<template>
  <!-- Modal avec fond flou -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      <div class="w-full flex-shrink-0 p-8 md:p-12">
        <div class="mb-5 text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Sécurisez votre compte</h2>
          <p class="text-gray-500">
            Cette étape est obligatoire pour renforcer la sécurité de votre compte. Vous n'aurez à le faire qu'une seule
            fois.
          </p>
        </div>

        <div class="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          v-if="newPasswordErrors._general">
          <p class="text-red-500 text-sm">{{ newPasswordErrors._general }}</p>
        </div>
        <form @submit.prevent="handleNewPasswordSubmit" class="space-y-6">
          <!-- Champ Nouveau mot de passe -->
          <div class="space-y-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="heroicons-outline:lock-closed" class="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input id="new-password" v-model="newPasswordForm.password" type="password"
                placeholder="Nouveau mot de passe"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                required />
            </div>

            <!-- Indicateur de force du mot de passe -->
            <div v-if="passwordValidation.hasPassword" class="text-xs">
              <p :class="passwordValidation.strengthColor">
                Force du mot de passe: {{ passwordValidation.strengthLevel }}
              </p>
              <p class="text-gray-600 text-xs mt-1" v-if="passwordValidation.strengthLevel.toLowerCase() !== 'fort'">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un
                caractère spécial.
              </p>
            </div>

            <p v-if="newPasswordErrors.password" class="text-red-500 text-sm mt-1">
              {{ newPasswordErrors.password }}
            </p>
          </div>

          <!-- Champ Confirmation mot de passe -->
          <div class="space-y-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon name="heroicons-outline:lock-closed" class="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input id="confirm-password" v-model="newPasswordForm.confirmPassword" type="password"
                placeholder="Confirmer le mot de passe" :class="[
                  'text-xs w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition',
                  passwordValidation.passwordsDontMatch ? 'border-red-500' : 'border-gray-300'
                ]" required />
            </div>

            <!-- Indicateur de correspondance -->
            <div v-if="newPasswordForm.confirmPassword" class="text-sm">
              <p v-if="passwordValidation.passwordsMatch" class="text-green-500">
                ✓ Les mots de passe correspondent
              </p>
              <p v-if="passwordValidation.passwordsDontMatch" class="text-red-500">
                ✗ Les mots de passe ne correspondent pas
              </p>
            </div>

            <p v-if="newPasswordErrors.confirmPassword" class="text-red-500 text-sm mt-1">
              {{ newPasswordErrors.confirmPassword }}
            </p>
          </div>

          <!-- Boutons -->
          <div class="flex flex-col space-y-4">
            <button type="submit"
              class="flex items-center justify-center w-full text-center bg-sky-800 hover:bg-sky-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isResetting || !passwordValidation.passwordsMatch">
              <Spinner :is-loading="isResetting" />
              <span class="ml-3">{{ isResetting ? 'Mise à jour en cours...' : 'Mettre à jour le mot de passe'
              }}</span>
            </button>
            
            <button type="button" @click="handleLogout"
              class="flex items-center justify-center w-full text-center bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoggingOut">
              <Spinner :is-loading="isLoggingOut" />
              <span class="ml-3">{{ isLoggingOut ? 'Déconnexion en cours ...' : 'Me déconnecter'
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '../components/partials/Spinner.vue';

const newPasswordForm = ref({
  password: '',
  confirmPassword: '',
});

const isResetting = ref<boolean>(false);
const isLoggingOut = ref<boolean>(false);

const { newPasswordErrors, user } = storeToRefs(useAuthStore());

const passwordValidation = computed(() => {
  const password = newPasswordForm.value.password;
  const confirmPassword = newPasswordForm.value.confirmPassword;

  // Vérification de la force du mot de passe
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isStrong = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  const isMedium = hasMinLength && ((hasUpperCase && hasLowerCase) || (hasNumbers && (hasUpperCase || hasLowerCase)));

  let strengthLevel = 'Faible';
  let strengthColor = 'text-red-500';

  if (isStrong) {
    strengthLevel = 'Fort';
    strengthColor = 'text-green-500';
  } else if (isMedium) {
    strengthLevel = 'Moyen';
    strengthColor = 'text-yellow-500';
  }

  // Vérification de la correspondance
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = password && confirmPassword && password !== confirmPassword;

  return {
    strengthLevel,
    strengthColor,
    passwordsMatch,
    passwordsDontMatch,
    hasPassword: password.length > 0
  };
});

const handleNewPasswordSubmit = async () => {
  if (!newPasswordForm.value.password || !newPasswordForm.value.confirmPassword) {
    return;
  }

  isResetting.value = true;
  try {
    await useAuthStore().definePassword({
      password: newPasswordForm.value.password,
      password_confirmation: newPasswordForm.value.confirmPassword
    });
    // Rediriger vers la connexion après succès
    useAlert().showAlert("Mot de passe mis à jour avec succès", "success", 7000);
    navigateTo(AppUrl.DASHBOARD);
    
  } finally {
    isResetting.value = false;
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true;
  await useAuthStore().logout();
}

onMounted(() => {
  if(user.value!.hasConfirmedPassword) {
    useAlert().showAlert("Votre mot de passe a déjà été confirmé", "info", 5000);
    return navigateTo(AppUrl.DASHBOARD);
  }
});

useHead({title: "Confirmer mon mot de passe"});
</script>