<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const userId = userStore.userId
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const selectedFilteredList = ref<string>('')

const confirm = useConfirm()

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean) => {
  let q
  if (isFilter) {
    q = query(
      collection(db, 'users', userId, 'interviews'),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilteredList.value)
    )
  } else {
    q = query(collection(db, 'users', userId, 'interviews'), orderBy('createdAt', 'desc'))
  }

  const listDocs = await getDocs(q)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const fetchAndSetInterviews = async (isFilter: boolean = false): Promise<void> => {
  isLoading.value = true
  const listInterview: Array<IInterview> = await getAllInterviews(isFilter)
  interviews.value = listInterview
  isLoading.value = false
}

const deleteInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Wollen Sie Interview wirklich löschen?',
    header: 'Interview löschen',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Nein',
    acceptLabel: 'Löschen',
    rejectClass: 'p-button-secondary, p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userId}/interviews`, id))
      await fetchAndSetInterviews()
    }
  })
}

const selectedFilter = async (): Promise<void> => {
  await fetchAndSetInterviews(true)
}

const clearFilter = async (): Promise<void> => {
  selectedFilteredList.value = ''
  await fetchAndSetInterviews()
}

onMounted(async () => {
  selectedFilteredList.value = ''
  await fetchAndSetInterviews()
})
</script>

<template>
  <app-dialog />
  <app-progress-spinner v-if="isLoading" />
  <div v-else-if="interviews.length">
    <h1>List of interview</h1>
    <div class="flex align-items-center mb-5">
      <div class="flex align-items-center mr-2">
        <app-radio-button
          v-model="selectedFilteredList"
          inputId="result1"
          name="result"
          value="Offer"
        ></app-radio-button>
        <label for="result1" class="ml-2">Offer</label>
      </div>
      <div class="flex align-items-center mr-2">
        <app-radio-button
          v-model="selectedFilteredList"
          inputId="result2"
          name="result"
          value="Reject"
        ></app-radio-button>
        <label for="result2" class="ml-2">Refusal</label>
      </div>
      <app-button class="mr-2" @click="selectedFilter" :disabled="!selectedFilteredList"
        >Select</app-button
      >
      <app-button severity="danger" @click="clearFilter" :disabled="!selectedFilteredList"
        >Cancel</app-button
      >
    </div>
    <app-datatable :value="interviews" tableStyle="min-width: 50rem">
      <app-column field="company" header="Company"></app-column>
      <app-column field="hrName" header="Name"></app-column>
      <app-column field="vacancyLink" header="Link">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Vacancy link</a>
        </template>
      </app-column>
      <app-column header="Contacts">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              class="contacts__telegram"
              target="_blank"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`tel:${slotProps.data.contactPhone}`"
              class="contacts__phone"
              target="_blank"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              class="contacts__whatsapp"
              target="_blank"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column header="Steps">
        <template #body="slotProps">
          <span v-if="!slotProps.data.steps">Not filled in</span>
          <div v-else class="interview-stages">
            <app-badge
              v-for="(step, i) in slotProps.data.steps"
              :key="i"
              :value="i + 1"
              rounded
              v-tooltip.top="step.name"
            ></app-badge>
          </div>
        </template>
      </app-column>
      <app-column header="Salary fork">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Not avaible</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column header="Result">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Not filled in </span>
          <template v-else>
            <app-badge :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'">{{
              slotProps.data.result
            }}</app-badge>
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info"></app-button>
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="deleteInterview(slotProps.data.id)"
            ></app-button>
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
  <h3 v-else>No interviews</h3>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
