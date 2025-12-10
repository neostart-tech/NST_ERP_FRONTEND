    <script setup>
    import { ref, watch, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import { useRuntimeConfig } from '#app';

    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();

    const productId = computed(() => route.params.id ? parseInt(route.params.id) : null);

    // Initialisation des données du formulaire avec les noms de champs du frontend
    const product = ref({
        nomProduit: '',
        referenceProduit: '', // J'ai renommé numeroLot en referenceProduit pour la clarté
        descriptionProduit: '', // Assurez-vous d'avoir ce champ dans votre formulaire si nécessaire
        prixAchat: null,
        prixVente: null,
        quantiteStock: null, // J'ai renommé quantite en quantiteStock pour la clarté
        seuilMinimum: null,
        isActive: true, // Assurez-vous d'avoir ce champ dans votre formulaire (checkbox)
        // fournisseur: '' // Ce champ n'est pas directement dans le modèle Product, il sera géré différemment
    });

    const loading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    // Configurez Axios localement pour ce composant (si vous n'utilisez pas le plugin global)
    // Sinon, supprimez cette partie et utilisez simplement `axios`
    const api = axios.create({
        baseURL: config.public.apiBase,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    // Fonction pour charger un produit existant (pour l'édition)
    const fetchProduct = async () => {
        if (!productId.value) return; // Ne rien faire si c'est une création
        loading.value = true;
        errorMessage.value = '';
        try {
            const response = await api.get(`/products/${productId.value}`);
            // Mappez les données de l'API (anglais) vers les champs du formulaire (français)
            product.value = {
                nomProduit: response.data.name,
                referenceProduit: response.data.reference,
                descriptionProduit: response.data.description,
                prixAchat: parseFloat(response.data.unit_price_purchase),
                prixVente: parseFloat(response.data.unit_price_sale),
                quantiteStock: parseInt(response.data.current_stock),
                seuilMinimum: parseInt(response.data.min_stock_alert),
                isActive: Boolean(response.data.is_active),
            };
        } catch (error) {
            console.error('Erreur lors du chargement du produit:', error.response ? error.response.data : error.message);
            errorMessage.value = 'Impossible de charger les informations du produit.';
            if (error.response && error.response.status === 404) {
                router.push({ path: '/produits' }); // Rediriger si produit non trouvé
            }
        } finally {
            loading.value = false;
        }
    };

    // Fonction de soumission du formulaire
    const submitForm = async () => {
        loading.value = true;
        successMessage.value = '';
        errorMessage.value = '';

        // Créez l'objet payload avec les noms de champs attendus par l'API Laravel
        const payload = {
            name: product.value.nomProduit,
            reference: product.value.referenceProduit, // Assurez-vous que c'est bien la référence
            description: product.value.descriptionProduit,
            unit_price_purchase: product.value.prixAchat,
            unit_price_sale: product.value.prixVente,
            current_stock: product.value.quantiteStock,
            min_stock_alert: product.value.seuilMinimum,
            is_active: product.value.isActive,
        };

        // Log du payload avant envoi (pour le débogage)
        console.log('Payload envoyé à l\'API:', payload);

        try {
            let response;
            if (productId.value) {
                // Pour la mise à jour (PUT)
                response = await api.put(`/products/${productId.value}`, payload);
                successMessage.value = 'Produit mis à jour avec succès!';
            } else {
                // Pour la création (POST)
                response = await api.post('/products', payload);
                successMessage.value = 'Produit ajouté avec succès!';
                resetForm(); // Réinitialiser le formulaire après création
            }
            console.log('Réponse de l\'API:', response.data);
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error.response ? error.response.data : error.message);
            errorMessage.value = 'Erreur lors de l\'enregistrement du produit. Veuillez vérifier les champs.';

            if (error.response && error.response.data && error.response.data.errors) {
                // Afficher les erreurs de validation spécifiques de Laravel
                for (const key in error.response.data.errors) {
                    errorMessage.value += `\n- ${error.response.data.errors[key][0]}`;
                }
            } else if (error.response && error.response.data && error.response.data.message) {
                errorMessage.value = error.response.data.message;
            }
        } finally {
            loading.value = false;
        }
    };

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        product.value = {
            nomProduit: '',
            referenceProduit: '',
            descriptionProduit: '',
            prixAchat: null,
            prixVente: null,
            quantiteStock: null,
            seuilMinimum: null,
            isActive: true,
        };
        successMessage.value = '';
        errorMessage.value = '';
    };

    // Charger le produit si un ID est présent dans l'URL (mode édition)
    onMounted(() => {
        if (productId.value) {
            fetchProduct();
        }
    });

    // Surveiller les changements d'ID dans l'URL pour recharger le produit
    watch(productId, (newId, oldId) => {
        if (newId !== oldId && newId) {
            fetchProduct();
        } else if (!newId) {
            resetForm(); // Réinitialiser si on passe du mode édition au mode création
        }
    });
    </script>
    