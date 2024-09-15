<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import type { IInterview, IStep } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'

const isLoading = ref<boolean>(true)

const userStore = useUserStore()

const route = useRoute()

const db = getFirestore()

const interview = ref<IInterview>()

const q = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const response = await getDoc(q)

  if (response.exists()) {
    const data = response.data() as IInterview

    if (data.steps && data.steps.length) {
      data.steps = data.steps.map((step: IStep) => {
        if (step.date && step.date instanceof Timestamp) {
          return {
            ...step,
            date: step.date.toDate()
          }
        }
        return step
      })
    }
    interview.value = data
  }

  isLoading.value = false
  console.log(interview.value)
}

const addStep = () => {
  if (interview.value) {
    interview.value.steps = interview.value.steps || []
    interview.value.steps.push({ name: '', date: null, comment: '' })
  }
}

const removeStep = (index: number) => {
  if (interview.value && interview.value.steps) {
    interview.value.steps.splice(index, 1)
  }
}

const saveInterview = async (): Promise<void> => {
  await updateDoc(q, {
    ...interview.value
  })
  alert('Interview updated successfully')
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <app-progress-spinner v-if="isLoading" />
  <div class="content-interview" v-else-if="interview?.id && !isLoading">
    <app-card>
      <template #title>Interview in the company {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Company</label>
          <app-input-text class="input mb-3" v-model="interview.company" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company">Vacancy(link)</label>
          <app-input-text class="input mb-3" v-model="interview.vacancyLink" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company">Contact (Name)</label>
          <app-input-text class="input mb-3" v-model="interview.hrName" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company">Telegram username HR</label>
          <app-input-text class="input mb-3" v-model="interview.contactTelegram" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company">WhatsApp HR</label>
          <app-input-text class="input mb-3" v-model="interview.contactWhatsApp" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company">Phone HR</label>
          <app-input-text class="input mb-3" v-model="interview.contactPhone" />
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryFrom"
              placeholder="salary from"
            ></app-input-number>
          </div>
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryTo"
              placeholder="salary to"
            ></app-input-number>
          </div>
        </div>
        <app-button
          icon="pi pi-plus"
          label="Add step for interview"
          severity="info"
          class="mb-3"
          @click="addStep"
        ></app-button>
        <div v-for="(step, index) in interview.steps" :key="index" class="interview-stage">
          <div class="flex flex-column gap-2">
            <label :for="`step-name-${index}`">Step name</label>
            <app-input-text v-model="step.name" class="input mb-3" />
          </div>
          <div class="flex flex-column gap-2">
            <label :for="`step-date-${index}`">Date of step</label>
            <app-calendar v-model="step.date" dateFormat="dd.mm.yy" class="input mb-3" />
          </div>
          <div class="flex flex-column gap-2">
            <label :for="`step-comment-${index}`">Comments</label>
            <app-textarea v-model="step.comment" class="input mb-3" row="5" />
          </div>
          <app-button
            label="Remove step"
            severity="danger"
            class="mb-3"
            @click="removeStep(index)"
          ></app-button>
        </div>
        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio-button
              v-model="interview.result"
              inputId="result1"
              name="result"
              value="Reject"
            ></app-radio-button>
            <label for="result1" class="ml-2">reject</label>
          </div>
          <div class="flex align-items-center">
            <app-radio-button
              v-model="interview.result"
              inputId="result2"
              name="result"
              value="Offer"
            ></app-radio-button>
            <label for="result2" class="ml-2">offer</label>
          </div>
        </div>
        <app-button label="Save interview" icon="pi pi-save" @click="saveInterview" />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
