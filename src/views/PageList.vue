<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const userId = userStore.userId
const db = getFirestore()
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const confirm = useConfirm()

const getAllInterviews = async <T extends IInterview>() => {
  const q = query(collection(db, 'users', userId, 'interviews'), orderBy('company', 'desc'))
  const listDocs = await getDocs(q)
  return listDocs.docs.map((doc) => doc.data() as T)
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

      const listInterview: Array<IInterview> = await getAllInterviews()
      interviews.value = [...listInterview]

      isLoading.value = false
    }
  })
}

onMounted(async () => {
  const listInterview: Array<IInterview> = await getAllInterviews()
  interviews.value = [...listInterview]
  isLoading.value = false
})
</script>

<template>
  <app-dialog />
  <app-progress-spinner v-if="isLoading" />
  <div v-else-if="interviews.length">
    <h1>Interviews liste</h1>
    <app-datatable :value="interviews" tableStyle="min-width: 50rem">
      <app-column field="company" header="Company"></app-column>
      <app-column field="hrName" header="Name"></app-column>
      <app-column field="vacancyLink" header="Link">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
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
  <h3 v-else>Keine interviews</h3>
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
</style>
