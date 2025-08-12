// src/stores/offers.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  offer,
  offerFormData,
  offerSubmission,
  SubmissionFormData,
  ProjectTask,
  TaskFormData,
  offerMetrics,
  offerFilters,
  offerSortOptions,
  offerStatus,
  offerPriority,
  TaskStatus,
} from '../models/offers'

export const useoffersStore = defineStore('offers', () => {
  // State
  const offers = ref<offer[]>([])
  const submissions = ref<offerSubmission[]>([])
  const tasks = ref<ProjectTask[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development - Following same pattern as sales store
  const mockoffers: offer[] = [
    {
      id: 'offer-001',
      reference: 'AO-2025-001',
      title: 'Modernisation du système informatique - Mairie de Lomé',
      description:
        "Appel d'offres pour la modernisation complète du système informatique de la mairie, incluant hardware, software et formation du personnel.",
      source: 'Site web municipal',
      publisher: 'Mairie de Lomé',
      deadline: '2025-02-15T17:00:00Z',
      estimatedValue: 150000,
      sector: 'Administration publique',
      location: 'Lomé, Togo',
      status: 'active',
      priority: 'high',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-18T14:30:00Z',
      documents: [
        {
          id: 'DOC-001',
          offerId: 'offer-001',
          name: 'Cahier des charges technique',
          type: 'cahier_charges',
          category: 'required',
          fileUrl: '/docs/cahier-charges-001.pdf',
          fileSize: 2500000,
          mimeType: 'application/pdf',
          uploadedAt: '2025-01-10T09:00:00Z',
          version: 1,
          isRequired: true,
          description: 'Spécifications techniques détaillées',
        },
      ],
      submissions: [],
      requirements: [
        'Certification ISO 27001',
        'Expérience minimum 5 ans',
        'Équipe technique certifiée',
        'Support 24/7 pendant 2 ans',
      ],
      criteria: [
        {
          id: 'CRIT-001',
          name: 'Expérience technique',
          weight: 40,
          description: 'Expertise dans les projets similaires',
          type: 'technical',
        },
        {
          id: 'CRIT-002',
          name: 'Proposition financière',
          weight: 30,
          description: 'Rapport qualité-prix',
          type: 'financial',
        },
      ],
      tags: ['IT', 'Modernisation', 'Formation', 'Support'],
    },
    {
      id: 'offer-002',
      reference: 'AO-2025-002',
      title: 'Développement application mobile - Banque Atlantique',
      description:
        "Création d'une application mobile bancaire moderne avec fonctionnalités avancées de sécurité et UX optimisée.",
      source: 'Appel direct',
      publisher: 'Banque Atlantique',
      deadline: '2025-02-28T18:00:00Z',
      estimatedValue: 80000,
      sector: 'Banque et Finance',
      location: 'Lomé, Togo',
      status: 'submitted',
      priority: 'medium',
      createdAt: '2025-01-05T14:00:00Z',
      updatedAt: '2025-01-15T16:45:00Z',
      documents: [],
      submissions: [],
      requirements: ['Certification bancaire', 'Sécurité renforcée', 'Tests de charge'],
      criteria: [],
      tags: ['Mobile', 'Banque', 'Sécurité', 'UX'],
    },
    {
      id: 'offer-003',
      reference: 'AO-2024-015',
      title: 'Infrastructure réseau Wifi - Université de Lomé',
      description:
        "Déploiement d'une infrastructure réseau WiFi complète pour couvrir l'ensemble du campus universitaire.",
      source: 'Appel public',
      publisher: 'Université de Lomé',
      deadline: '2025-03-01T15:00:00Z',
      estimatedValue: 200000,
      sector: 'Éducation',
      location: 'Lomé, Togo',
      status: 'won',
      priority: 'critical',
      createdAt: '2024-12-15T08:00:00Z',
      updatedAt: '2025-01-10T11:20:00Z',
      documents: [],
      submissions: [],
      requirements: ['Certification Cisco', 'Garantie 3 ans', 'Formation administrateurs'],
      criteria: [],
      tags: ['Réseau', 'Université', 'Wifi', 'Infrastructure'],
    },
  ]

  const mockTasks: ProjectTask[] = [
    {
      id: 'TASK-001',
      offerId: 'offer-001',
      title: 'Analyse technique du cahier des charges',
      description:
        'Étudier en détail les spécifications techniques et identifier les points critiques',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Jean Dupont',
      dueDate: '2025-01-20T17:00:00Z',
      estimatedHours: 8,
      actualHours: 6,
      dependencies: [],
      tags: ['Analyse', 'Technique'],
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-18T14:30:00Z',
    },
    {
      id: 'TASK-002',
      offerId: 'offer-001',
      title: 'Préparation proposition technique',
      description: 'Rédiger la proposition technique détaillée avec architecture et planning',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Marie Martin',
      dueDate: '2025-01-25T17:00:00Z',
      estimatedHours: 16,
      dependencies: ['TASK-001'],
      tags: ['Rédaction', 'Technique'],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-19T09:15:00Z',
    },
  ]

  const mockSubmissions: offerSubmission[] = [
    {
      id: 'SUB-001',
      offerId: 'offer-002',
      submittedAt: '2025-01-15T16:45:00Z',
      status: 'submitted',
      documents: [
        {
          id: 'DOC-SUB-001',
          name: 'Proposition technique mobile banking',
          type: 'cahier_charges',
          fileUrl: '/submissions/tech-proposal-001.pdf',
          generated: false,
        },
      ],
      proposal: {
        id: 'PROP-001',
        technicalOffer:
          'Notre solution propose une architecture moderne basée sur les dernières technologies cloud...',
        financialOffer: {
          totalAmount: 75000,
          breakdown: [
            {
              category: 'Développement',
              description: "Développement de l'application mobile",
              quantity: 1,
              unitPrice: 50000,
              totalPrice: 50000,
            },
            {
              category: 'Tests',
              description: 'Tests et validation',
              quantity: 1,
              unitPrice: 15000,
              totalPrice: 15000,
            },
            {
              category: 'Déploiement',
              description: 'Mise en production',
              quantity: 1,
              unitPrice: 10000,
              totalPrice: 10000,
            },
          ],
          paymentTerms: '30% à la signature, 50% à la livraison, 20% après recette',
          currency: 'EUR',
          taxIncluded: false,
        },
        deliveryPlan: {
          phases: [
            {
              id: 'PHASE-001',
              name: 'Développement',
              description: 'Phase de développement',
              startDate: '2025-02-01T00:00:00Z',
              endDate: '2025-04-01T00:00:00Z',
              deliverables: ['Application mobile iOS', 'Application mobile Android'],
              dependencies: [],
            },
          ],
          totalDuration: 90,
          milestones: [
            {
              id: 'MILESTONE-001',
              name: 'Livraison v1',
              date: '2025-04-01T00:00:00Z',
              deliverables: ['Applications mobiles'],
              criticalPath: true,
            },
          ],
        },
        team: [
          {
            id: 'T1',
            role: 'Chef de projet',
            name: 'Jean Dupont',
            experience: '8 ans',
            allocation: 50,
            skills: ['Gestion', 'Mobile'],
            skillsText: ''
          },
          {
            id: 'T2',
            role: 'Développeur mobile',
            name: 'Marie Martin',
            experience: '5 ans',
            allocation: 80,
            skills: ['React Native', 'iOS', 'Android'],
            skillsText: ''
          },
        ],
        guarantees: ['Garantie 1 an', 'Support technique'],
        validityPeriod: 30,
      },
      result: {
        id: 'RES-001',
        receivedAt: '2025-01-18T10:00:00Z',
        status: 'pending',
        ranking: 1,
        feedback: 'Excellente proposition, nous étudions les détails',
      },
      followUp: [
        {
          id: 'FU-001',
          type: 'call',
          description: 'Appel de suivi avec le directeur technique',
          dueDate: '2025-01-22T09:00:00Z',
          completed: false,
          assignedTo: 'Jean Dupont',
        },
      ],
    },
  ]

  // Initialize with mock data
  if (offers.value.length === 0) {
    offers.value = mockoffers
    tasks.value = mockTasks
    submissions.value = mockSubmissions
  }

  // Computed values - Following sales store pattern
  const activeoffers = computed(() => offers.value.filter((t) => t.status === 'active'))

  const submittedoffers = computed(() => offers.value.filter((t) => t.status === 'submitted'))

  const wonoffers = computed(() => offers.value.filter((t) => t.status === 'won'))

  const metrics = computed((): offerMetrics => {
    const total = offers.value.length
    const active = activeoffers.value.length
    const submitted = submittedoffers.value.length
    const won = wonoffers.value.length
    const lost = offers.value.filter((t) => t.status === 'lost').length

    const totalValue = offers.value.reduce((sum, t) => sum + t.estimatedValue, 0)
    const wonValue = wonoffers.value.reduce((sum, t) => sum + t.estimatedValue, 0)
    const pendingValue = activeoffers.value.reduce((sum, t) => sum + t.estimatedValue, 0)

    return {
      totaloffers: total,
      activeoffers: active,
      submittedoffers: submitted,
      wonoffers: won,
      lostoffers: lost,
      successRate: submitted > 0 ? (won / submitted) * 100 : 0,
      averageValue: total > 0 ? totalValue / total : 0,
      totalValue,
      wonValue,
      pendingValue,
      monthlySubmissions: [],
      sectorDistribution: [],
      statusDistribution: [],
    }
  })

  const overdueTasks = computed(() =>
    tasks.value.filter((t) => {
      const dueDate = new Date(t.dueDate)
      const now = new Date()
      return dueDate < now && (t.status === 'todo' || t.status === 'in_progress')
    }),
  )

  // API Methods - These would normally call the backend
  const fetchoffers = async (filters?: offerFilters): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // In a real app, this would call the API
      // const response = await offersService.getoffers(filters)
      // offers.value = response.data

      // For now, we just use the mock data which is already loaded
      console.log('Fetching offers with filters:', filters)
    } catch (err) {
      error.value = "Erreur lors du chargement des appels d'offres"
      console.error('Error fetching offers:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMetrics = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, this would call the API
      // const response = await offersService.getofferMetrics()
      // Update metrics computed value automatically updates

      console.log('Metrics fetched successfully')
    } catch (err) {
      error.value = 'Erreur lors du chargement des métriques'
      console.error('Error fetching metrics:', err)
    } finally {
      isLoading.value = false
    }
  }

  const urgentoffers = computed(() => {
    const now = new Date()
    const urgentThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 jours

    return offers.value.filter((offer) => {
      const deadline = new Date(offer.deadline)
      return (
        deadline <= urgentThreshold &&
        deadline > now &&
        (offer.status === 'active' || offer.status === 'draft')
      )
    })
  })

  // CRUD Actions
  const createoffer = async (data: offerFormData): Promise<offer> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newoffer: offer = {
        id: `offer-${Date.now()}`,
        ...data,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
        submissions: [],
        criteria: [],
      }

      offers.value.unshift(newoffer)
      return newoffer
    } catch (err) {
      error.value = "Erreur lors de la création de l'appel d'offres"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateoffer = async (id: string, data: Partial<offerFormData>): Promise<offer> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = offers.value.findIndex((t) => t.id === id)
      if (index === -1) throw new Error("Appel d'offres non trouvé")

      const updatedoffer = {
        ...offers.value[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }

      offers.value[index] = updatedoffer
      return updatedoffer
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteoffer = async (id: string): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = offers.value.findIndex((t) => t.id === id)
      if (index === -1) throw new Error("Appel d'offres non trouvé")

      offers.value.splice(index, 1)
      // Remove related tasks
      tasks.value = tasks.value.filter((task) => task.offerId !== id)
    } catch (err) {
      error.value = 'Erreur lors de la suppression'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateofferStatus = async (id: string, status: offerStatus): Promise<void> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const offer = offers.value.find((t) => t.id === id)
      if (offer) {
        offer.status = status
        offer.updatedAt = new Date().toISOString()
      }
    } finally {
      isLoading.value = false
    }
  }

  // Task Management
  const createTask = async (data: TaskFormData & { offerId: string }): Promise<ProjectTask> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTask: ProjectTask = {
        id: `TASK-${Date.now()}`,
        ...data,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      tasks.value.unshift(newTask)
      return newTask
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: string, data: Partial<TaskFormData>): Promise<ProjectTask> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = tasks.value.findIndex((t) => t.id === id)
      if (index === -1) throw new Error('Tâche non trouvée')

      const updatedTask = {
        ...tasks.value[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }

      tasks.value[index] = updatedTask
      return updatedTask
    } finally {
      isLoading.value = false
    }
  }

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 200))

      const task = tasks.value.find((t) => t.id === id)
      if (task) {
        task.status = status
        task.updatedAt = new Date().toISOString()

        if (status === 'completed' && !task.actualHours) {
          task.actualHours = task.estimatedHours
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    } finally {
      isLoading.value = false
    }
  }

  // Submission Management
  const createSubmission = async (data: SubmissionFormData): Promise<offerSubmission> => {
    isLoading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newSubmission: offerSubmission = {
        id: `SUB-${Date.now()}`,
        offerId: data.offerId,
        submittedAt: new Date().toISOString(),
        status: 'draft',
        documents: [],
        proposal: {
          id: `PROP-${Date.now()}`,
          technicalOffer: data.technicalOffer,
          financialOffer: data.financialOffer,
          deliveryPlan: data.deliveryPlan,
          team: data.team,
          guarantees: data.guarantees,
          validityPeriod: data.validityPeriod,
        },
        followUp: [],
      }

      submissions.value.unshift(newSubmission)
      return newSubmission
    } finally {
      isLoading.value = false
    }
  }

  // Getters - Following sales store pattern
  const getoffers = (): offer[] => {
    return offers.value
  }

  const getAllTasks = (): ProjectTask[] => {
    return tasks.value
  }

  const getAllSubmissions = (): offerSubmission[] => {
    return submissions.value
  }

  const getofferById = (id: string): offer | undefined => {
    return offers.value.find((t) => t.id === id)
  }

  const getTaskById = (id: string): ProjectTask | undefined => {
    return tasks.value.find((t) => t.id === id)
  }

  const getSubmissionById = (id: string): offerSubmission | undefined => {
    return submissions.value.find((s) => s.id === id)
  }

  const getofferTasks = (offerId: string): ProjectTask[] => {
    return tasks.value.filter((t) => t.offerId === offerId)
  }

  const getofferSubmissions = (offerId: string): offerSubmission[] => {
    return submissions.value.filter((s) => s.offerId === offerId)
  }

  const getFilteredoffers = (filters: offerFilters, sort?: offerSortOptions): offer[] => {
    let filtered = [...offers.value]

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.reference.toLowerCase().includes(search) ||
          t.publisher.toLowerCase().includes(search),
      )
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((t) => filters.status!.includes(t.status))
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((t) => filters.priority!.includes(t.priority))
    }

    if (filters.sector && filters.sector.length > 0) {
      filtered = filtered.filter((t) => filters.sector!.includes(t.sector))
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      filtered = filtered.filter((t) => {
        const deadline = new Date(t.deadline)
        return deadline >= startDate && deadline <= endDate
      })
    }

    if (filters.estimatedValueRange) {
      filtered = filtered.filter(
        (t) =>
          t.estimatedValue >= filters.estimatedValueRange!.min &&
          t.estimatedValue <= filters.estimatedValueRange!.max,
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((t) => filters.tags!.some((tag) => t.tags.includes(tag)))
    }

    // Apply sorting
    if (sort) {
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sort.field) {
          case 'deadline':
            aValue = new Date(a.deadline).getTime()
            bValue = new Date(b.deadline).getTime()
            break
          case 'estimatedValue':
            aValue = a.estimatedValue
            bValue = b.estimatedValue
            break
          case 'priority':
            const priorityWeight = { low: 1, medium: 2, high: 3, critical: 4 }
            aValue = priorityWeight[a.priority]
            bValue = priorityWeight[b.priority]
            break
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime()
            bValue = new Date(b.createdAt).getTime()
            break
          default:
            aValue = new Date(a.updatedAt).getTime()
            bValue = new Date(b.updatedAt).getTime()
        }

        if (sort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }

  // Return everything that needs to be exposed
  return {
    // State
    offers,
    submissions,
    tasks,
    isLoading,
    error,

    // Computed
    metrics,
    activeoffers,
    submittedoffers,
    wonoffers,
    overdueTasks,
    urgentoffers,

    // API Actions
    fetchoffers,
    fetchMetrics,
    

    // CRUD Actions
    createoffer,
    updateoffer,
    deleteoffer,
    updateofferStatus,

    // Task Management
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,

    // Submission Management
    createSubmission,

    // Getters
    getoffers,
    getAllTasks,
    getAllSubmissions,
    getofferById,
    getTaskById,
    getSubmissionById,
    getofferTasks,
    getofferSubmissions,
    getFilteredoffers,
  }
})
