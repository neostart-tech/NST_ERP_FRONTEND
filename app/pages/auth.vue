<template>
  <div class="min-h-screen flex items-center justify-center bg-[#93C5FD] px-4 sm:px-6 lg:px-0">
    <div class="flex w-full max-w-4xl min-h-[250px] overflow-hidden bg-white rounded-lg shadow-xl">
      <!-- Côté gauche - Logo -->
      <div class="hidden md:flex md:w-1/2 bg-sky-800 text-white flex-col justify-center items-center p-8">
        <div class="space-y-4 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Neo-ERP</h1>
          <Icon name="heroicons-outline:rectangle-group" size="96" />
        </div>
      </div>

      <!-- Côté droit - Container avec overflow hidden pour l'animation -->
      <div class="w-full md:w-1/2 relative overflow-hidden">
        <div class="flex transition-transform duration-500 ease-in-out" :style="{
          transform: showPasswordReset ? 'translateX(-200%)' :
            showForgotPassword ? 'translateX(-100%)' : 'translateX(0%)'
        }">

          <!-- Formulaire de connexion -->
          <div class="w-full flex-shrink-0 p-8 md:p-12">
            <div class="mb-10 text-center">
              <h2 class="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h2>
              <p class="text-gray-500">Connectez-vous pour accéder à votre compte</p>
              <div v-if="isInvalidCredentials"
                class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p class="text-red-500 text-sm">
                  Identifiants de connexion invalides
                </p>
              </div>

              <div v-if="reset" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                <p class="text-green-500 text-sm">
                  Votre mot de passe a été réinitialisé avec succès
                </p>
              </div>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
              <!-- Champ Email -->
              <div class="space-y-2">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name="heroicons-outline:mail" class="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input id="email" v-model="credentials.email" type="email" placeholder="Email"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    required />
                </div>
                <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
                  {{ validationErrors.email }}
                </p>
              </div>

              <!-- Champ Mot de passe -->
              <div class="space-y-2">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name="heroicons-outline:lock-closed" class="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input id="password" v-model="credentials.password" type="password" placeholder="Mot de passe" :class="[
                    'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition',
                    validationErrors.password ? 'border-red-500' : '',
                  ]" required />
                </div>
                <p v-if="validationErrors.password" class="text-red-500 text-sm mt-1">
                  {{ validationErrors.password }}
                </p>
              </div>

              <!-- Options -->
              <div class="flex items-center justify-end">
                <!-- <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    class="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
                </div> -->
                <div>
                  <a href="#" @click.prevent="navigateToTab('mot-de-passe-oublie')"
                    class="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-200">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <!-- Bouton de connexion -->
              <div class="flex justify-center">
                <button type="submit"
                  class="flex items-center justify-center w-full md:w-80 text-center bg-sky-800 hover:bg-sky-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  :disabled="isLoading">
                  <Spinner :is-loading="isLoading" />
                  <span class="ml-3">{{ isLoading ? 'Connexion en cours...' : 'Connexion' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Formulaire de mot de passe oublié -->
          <div class="w-full flex-shrink-0 p-8 md:p-12">
            <div class="mb-10 text-center">
              <h2 class="text-3xl font-bold text-gray-800 mb-2">Mot de passe oublié</h2>
              <p class="text-gray-500">Entrez votre email pour réinitialiser votre mot de passe</p>
              <div v-if="resetEmailSent"
                class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                <div class="text-green-500 text-sm">
                  <p>
                    Un email de réinitialisation a été envoyé sur <strong>{{ resetCredentials }}</strong>
                  </p>
                  <p>Veuillez vérifier votre boîte mail et vos spams.</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="handlePasswordReset" class="space-y-6">
              <!-- Champ Email -->
              <div class="space-y-2">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name="heroicons-outline:mail" class="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input id="reset-email" v-model="resetCredentials" type="email" placeholder="Email"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    required />
                </div>
                <p v-if="resetValidationErrors.email" class="text-red-500 text-xs mt-1">
                  {{ resetValidationErrors.email }}
                </p>
              </div>

              <!-- Boutons -->
              <div class="flex flex-col space-y-4 mt-3">
                <button type="submit"
                  class="flex items-center justify-center w-full text-center bg-sky-800 hover:bg-sky-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  :disabled="isResetting">
                  <Spinner :is-loading="isResetting" />
                  <span class="ml-3">{{ isResetting ? 'Envoi en cours...' : 'Réinitialiser le mot de passe' }}</span>
                </button>


                <button type="button" @click="navigateToTab('login')"
                  class="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200">
                  Retour à la connexion
                </button>
              </div>
            </form>
          </div>

          <!-- Formulaire de réinitialisation de mot de passe -->
          <div class="w-full flex-shrink-0 p-8 md:p-12">
            <div class="mb-10 text-center">
              <h2 class="text-3xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h2>
              <p class="text-gray-500">Choisissez un nouveau mot de passe sécurisé</p>
              <p class="text-sm text-gray-400 mt-2">Email: {{ resetEmail }}</p>
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
                  <p class="text-gray-600 text-xs mt-1"
                    v-if="passwordValidation.strengthLevel.toLowerCase() !== 'fort'">
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
                  :disabled="isResetting || !passwordValidation.passwordsMatch || !isResetFormValid">
                  <Spinner :is-loading="isResetting" />
                  <span class="ml-3">{{ isResetting ? 'Mise à jour en cours...' : 'Mettre à jour le mot de passe'
                  }}</span>
                </button>

                <div class="flex justify-end">
                  <a href="#" @click.prevent="resendResetLink" v-if="isPasswordRestFailed"
                    class="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-200">
                    Demander un nouveau lien ?
                  </a>
                </div>
                <div class="flex justify-end">
                  <a href="#" @click="navigateToTab('login')"
                    class="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-200">
                    Retour à la connexion
                  </a>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/partials/Spinner.vue';
import { createDefaultLoginCredential, type LoginCredential, type PasswordResetData } from '~/models/User';

definePageMeta({ layout: false });
// Gestion des onglets via l'URL
const route = useRoute();

// Computed pour récupérer l'onglet actuel depuis l'URL
const currentTab = computed(() => route.query.tab as string || 'login');

const pageTitle = computed(() => {
  switch (currentTab.value) {
    case 'mot-de-passe-oublie':
      return 'Mot de passe oublié';
    case 'reinitialiser-mot-de-passe':
      return 'Réinitialiser mot de passe';
    default:
      return 'Connexion';
  }
});
useHead(() => ({
  title: pageTitle.value
}));

const isLoading = ref<boolean>(false);
const isResetting = ref<boolean>(false);
const reset = ref<boolean>(false);
const isInvalidCredentials = ref<boolean>(false);
const resetEmailSent = ref<boolean>(false);
const isPasswordRestFailed = ref<boolean>(false);
const resetMailStore = ref<string>("");

const authStore = useAuthStore();

// Computed pour vérifier quel formulaire afficher
const showForgotPassword = computed(() => currentTab.value === 'mot-de-passe-oublie');
const showPasswordReset = computed(() => currentTab.value === 'reinitialiser-mot-de-passe');
const showLogin = computed(() => currentTab.value === 'login');

// Paramètres pour la réinitialisation
const resetToken = computed(() => route.query['reset-token'] as string || '');
const resetEmail = computed(() => route.query.email as string || '');

// Validation des paramètres requis pour la réinitialisation
const isResetFormValid = computed(() => {
  return showPasswordReset.value && resetToken.value && resetEmail.value;
});

// Redirection automatique si les paramètres sont manquants
onMounted(() => {
  if (showPasswordReset.value && (!resetToken.value || !resetEmail.value)) {
    // Rediriger vers auth si les paramètres sont manquants
    navigateTo('/auth?tab=login');
  }

  // Pré-remplir l'email si disponible dans l'URL
  if (resetEmail.value) {
    newPasswordForm.value.email = resetEmail.value;
  }
});

const credentials = ref<LoginCredential>(createDefaultLoginCredential());
const resetCredentials = ref<string>("");

// Données pour le formulaire de réinitialisation de mot de passe
const newPasswordForm = ref({
  password: '',
  confirmPassword: '',
  email: ''
});

// Computed pour vérifier la force du mot de passe et la correspondance
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

const { validationErrors, resetValidationErrors, newPasswordErrors } = storeToRefs(useAuthStore());

const handleLogin = async () => {
  isLoading.value = true;
  isInvalidCredentials.value = false;
  try {
    await useAuthStore().login(credentials.value);
    credentials.value = createDefaultLoginCredential();
    await navigateTo(AppUrl.DASHBOARD);
  }
  catch (error) {
    isInvalidCredentials.value = true;
  }
  finally {
    isLoading.value = false;
  }
}

// Lorsque l'utilisateur clique sur "Mot de passe oublié", on pré-remplit l'email s'il était déjà saisi
watch(showForgotPassword, (newValue) => {
  if (!newValue) return;
  resetCredentials.value = credentials.value.email || resetMailStore.value;
  resetEmailSent.value = false;
});

// Fonction pour naviguer entre les onglets
const navigateToTab = (tab: string) => {
  if (tab === 'login') {
    navigateTo('/auth?tab=login');
  } else {
    navigateTo(`/auth?tab=${tab}`);
  }
};

const handlePasswordReset = async () => {
  isResetting.value = true;
  resetValidationErrors.value = {};
  try {
    authStore.initPasswordReset(resetCredentials.value);
    resetEmailSent.value = true;
  } finally {
    isResetting.value = false;
  }
}

const handleNewPasswordSubmit = async () => {
  isResetting.value = true;
  newPasswordErrors.value = {};

  // Validation
  if (!passwordValidation.value.passwordsMatch) {
    newPasswordErrors.value = { confirmPassword: "Les mots de passe ne correspondent pas" };
    return;
  }

  if (passwordValidation.value.strengthLevel === 'Faible') {
    newPasswordErrors.value = { password: "Le mot de passe doit être plus fort" };
    return;
  }

  if (!isResetFormValid.value) {
    newPasswordErrors.value = { password: "Token ou email manquant" };
    return;
  }

  try {
    const resetData: PasswordResetData = {
      token: resetToken.value,
      email: resetEmail.value,
      password: newPasswordForm.value.password,
      password_confirmation: newPasswordForm.value.confirmPassword
    };

    // Mise à jour du mot de passe
    await authStore.resetPassword(resetData);
    reset.value = true;

    // Rediriger vers la connexion après succès
    navigateTo('/auth?tab=login');

  } catch (error) {
    isPasswordRestFailed.value = true;
    newPasswordErrors.value = { password: error.message };
  } finally {
    isResetting.value = false;
  }
}

const resendResetLink = () => {
  resetMailStore.value = resetEmail.value;
  navigateToTab('mot-de-passe-oublie');
}

</script>