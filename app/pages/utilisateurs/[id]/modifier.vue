<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
		<form @submit.prevent="saveUser">
			<!-- Header -->
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
				<div>
					<h4 class="text-2xl font-semibold text-gray-900">
						Modifier les informations d'un utilisateur
					</h4>
					<p class="text-sm text-gray-500 mt-1">Les champs marqués d'une
						étoile sont obligatoires.</p>
				</div>
				<button @click="navigateTo(AppUrl.USERS_INDEX)" type="button"
								class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
					<Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5 mr-2"/>
					Retour à la liste
				</button>
			</div>

			<!-- Form sections -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

				<!-- Informations personnelles -->
				<div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
					<h5 class="text-sm font-medium text-gray-700 mb-3">Informations personnelles</h5>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Nom
								<RequiredField/>
							</label>
							<input v-model="userForm.lastName" name="lastName" type="text" required :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.last_name ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Nom de l'utilisateur"/>
							<p v-if="validationErrors.last_name" class="text-red-500 text-sm mt-1">{{
									validationErrors.last_name
								}}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Prénoms
								<RequiredField/>
							</label>
							<input v-model="userForm.firstName" name="first_name" type="text" required :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.first_name ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Prénoms de l'utilisateur"/>
							<p v-if="validationErrors.first_name" class="text-red-500 text-sm mt-1">{{
									validationErrors.first_name
								}}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Téléphone
								<RequiredField/>
							</label>
							<input v-model="userForm.phone" name="phone" type="text" :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.phone ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Numéro de téléphone"/>
							<p v-if="validationErrors.phone" class="text-red-500 text-sm mt-1">{{ validationErrors.phone }}</p>
						</div>
					</div>
				</div>

				<!-- Compte et contrat -->
				<div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
					<h5 class="text-sm font-medium text-gray-700 mb-3">Compte</h5>

					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Email
								<RequiredField/>
							</label>
							<input v-model="userForm.email" name="email" type="email" required :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.email ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Email de l'utilisateur"/>
							<p class="text-xs text-gray-500 mt-1">L'email servira pour la connexion et les notifications.</p>
							<p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">{{ validationErrors.email }}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Nom d'utilisateur (Pseudo)
								<RequiredField/>
							</label>
							<input v-model="userForm.login" name="login" type="text" required :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.login ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Nom d'utilisateur"/>
							<p v-if="validationErrors.login" class="text-red-500 text-sm mt-1">{{ validationErrors.login }}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Année d'embauche
								<RequiredField/>
							</label>
							<input v-model="userForm.hiredYear" type="date" :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.hired_year ? 'border-red-500' : 'border-gray-300',
								]" placeholder="Année d'embauche"/>
							<p v-if="validationErrors.hired_year" class="text-red-500 text-sm mt-1">{{
									validationErrors.hired_year
								}}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Rôle
								<RequiredField/>
							</label>
							<select v-model="userForm.role" name="role" required :class="[
									'w-full rounded-md px-3 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500',
									validationErrors.role ? 'border-red-500' : 'border-gray-300',
								]">
								<option value="" disabled>Sélectionnez un rôle</option>
								<option v-for="role in userRoles" :key="role" :value="role">
									{{ getRoleName(role) }}
								</option>
							</select>
							<p v-if="validationErrors.role" class="text-red-500 text-sm mt-1">{{ validationErrors.role }}</p>
						</div>
					</div>
				</div>

			</div>

			<!-- Bouton submit -->
			<div class="flex justify-center md:justify-end mt-2">
				<button type="submit"
								class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-3"
								:disabled="isLoading">
					<Spinner :isLoading="isLoading" text="Enregistrement en cours..." v-if="isLoading"/>
					<span v-else>Enregister les données de l'utilisateur</span>
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";

useHead({title: "Ajouter un utilisateur"});
import {ref} from 'vue';
import {useRouter} from '#app';
import Spinner from '@/components/partials/Spinner.vue';
import {createDefaultUserForm, getRoleName, type User, type UserCreateForm, UserRole} from '~/models/User';
import {useUserStore} from '@/stores/UserStore';
import {storeToRefs} from 'pinia';
import RequiredField from "@/components/partials/RequiredField.vue";

const router = useRouter();
const navigateTo = router.push;

const userId = useRoute().params.id;
const userStore = useUserStore();
const userForm = ref<UserCreateForm>(createDefaultUserForm());
const {isLoading, validationErrors} = storeToRefs(userStore);

const userRoles = Object.values(UserRole);

const saveUser = async () => {
	try {
		await userStore.updateUser(userForm.value, userId as string);
		useAlert().showAlert("L'utilisateur a été ajouté avec succès", "success");
		Swal.fire({
			icon: "success",
			html: `Données de l'utilisateur ${userForm.value.firstName} ${userForm.value.lastName} mises à jour avec succès`
		}).then();
	} catch (error) {
		const errorLength = Object.keys(validationErrors.value).length;
		let alertText = "Une erreur est survenue lors de l'ajout de l'utilisateur";
		if (errorLength > 1) {
			alertText = errorLength + " erreurs sont survenues lors de l'ajout de l'utilisateur";
		}
		useAlert().showAlert(alertText, "error");
	}
};

onMounted(async () => {
	isLoading.value = true;
	Swal.fire({
		title: 'Chargement en cours',
		text: 'Veuillez patienter pendant que nous récupérons les données de l\'utilisateur...',
		allowOutsideClick: false,
		didOpen: () => {
			Swal.showLoading();
		}
	}).then();
	try {
		userForm.value = await userStore.find(userId as string);
	} catch (error) {
		await Swal.fire({
			title: 'Erreur',
			text: 'Une erreur est survenue lors de la récupération des données de l\'offre. Veuillez réessayer plus tard.',
			icon: 'error',
			confirmButtonText: 'OK'
		}).then(() => {
			navigateTo(AppUrl.USERS_INDEX);
		});
	} finally {
		Swal.close();
	}
});
</script>
