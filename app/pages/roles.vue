<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
		<div class="max-w-6xl mx-auto">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h1 class="text-2xl font-semibold text-gray-800">Aperçu des rôles</h1>
					<p class="text-sm text-gray-500 mt-1">Vue des rôles et des pages auxquelles ils donnent accès.</p>
				</div>
			</div>

			<!-- Table pour grand écran -->
			<div class="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages
							accessibles
						</th>
					</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-100">
					<tr v-for="role in roles" :key="role" class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{{ getRoleName(role) }}</div>
							<div class="text-xs text-gray-500 mt-1">{{ role }} ({{ accessibleByRole[role].length }} rôles)</div>
						</td>
						<td class="px-6 py-4">
							<div class="flex flex-wrap gap-2">
                  <span v-for="page in (accessibleByRole[role] || [])" :key="page"
												class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                    {{ page }}
                  </span>
								<span v-if="(accessibleByRole[role] || []).length === 0"
											class="text-sm text-gray-400">Aucune page</span>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>

			<!-- Cartes pour petits et moyens écrans -->
			<div class="grid grid-cols-1 gap-4 lg:hidden">
				<div v-for="role in roles" :key="role" class="bg-white shadow rounded-lg p-4">
					<div class="flex items-center justify-between">
						<div>
							<div class="text-lg font-semibold text-gray-800">{{ getRoleName(role) }}</div>
							<div class="text-sm text-gray-500">{{ role }} ({{ accessibleByRole[role].length }} rôles)</div>
						</div>
					</div>

					<div class="mt-3">
						<p class="text-sm text-gray-600 mb-2">Pages accessibles</p>
						<div class="flex flex-wrap gap-2">
              <span v-for="page in (accessibleByRole[role] || [])" :key="page"
										class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100">
                {{ page }}
              </span>
							<span v-if="(accessibleByRole[role] || []).length === 0" class="text-sm text-gray-400">Aucune page</span>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {sidebarMenu} from '@/utils/sidebarConfig';
import {UserRole, getRoleName} from '~/models/User';

useHead({title: "Rôles et accès"});

// Liste des rôles définis
const roles = Object.values(UserRole) as UserRole[];

// Construire une map role -> pages accessibles
const accessibleByRole = computed<Record<UserRole, string[]>>(() => {
	const map = {} as Record<UserRole, string[]>;
	roles.forEach((r) => (map[r] = []));

	const addPageForRole = (role: UserRole | string, pageName: string) => {
		const key = role as UserRole;
		if (!map[key]) map[key] = [];
		if (!map[key].includes(pageName)) map[key].push(pageName);
	};

	const checkAccessible = (role: UserRole | string, accessList?: any[]) => {
		if (!accessList) return true; // si non défini, considérer accessible
		return accessList.includes(role);
	};

	sidebarMenu.forEach((menu) => {
		// Determine which roles can access this menu (parent)
		const parentAccess = menu.accessibleTo as (UserRole | undefined)[] | undefined;

		// For each role, if parentAccess allows it, add parent item
		roles.forEach((r) => {
			if (checkAccessible(r, parentAccess)) {
				addPageForRole(r, menu.name);
			}
		});

		// Submenus - if present, determine access per submenu (fallback to parent if submenu has no accessibleTo)
		if (menu.submenus && Array.isArray(menu.submenus)) {
			menu.submenus.forEach((sm) => {
				const smAccess = (sm as any).accessibleTo as (UserRole | undefined)[] | undefined;
				roles.forEach((r) => {
					const allowed = smAccess ? checkAccessible(r, smAccess) : checkAccessible(r, parentAccess);
					if (allowed) {
						addPageForRole(r, sm.name);
					}
				});
			});
		}
	});

	return map;
});
</script>
