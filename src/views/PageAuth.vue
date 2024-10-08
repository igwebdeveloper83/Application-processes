<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const isLogin = ref<boolean>(true)
const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)
const toast = useToast()

const router = useRouter()

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}
const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Haben Sie noch keinen Account?' : 'Haben Sie schon einen Account?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Erstellen Sie jetzt' : 'Melden Sie sich an'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Login' : 'Registrieren'
})

const signUp = async (): Promise<void> => {
  isLoading.value = true
  const auth = getAuth()
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    toast.add({
      severity: 'success',
      summary: 'Sie haben sich erfolgreich registriert',
      life: 3000
    })
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
  } finally {
    isLoading.value = false
  }
}

const signIn = async (): Promise<void> => {
  isLoading.value = true
  const auth = getAuth()
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
  } finally {
    isLoading.value = false
  }
}

const submitForm = (): void => {
  if (isLogin.value) {
    signIn()
  } else {
    signUp()
  }
}
</script>

<template>
  <app-toast position="bottom-right" />
  <div class="flex justify-content-center p-2">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="toggleAuth">
          {{ linkAccountText }}
        </a>
      </div>

      <form @submit.prevent="submitForm">
        <label for="email1" class="block text-900 font-medium mb-2">Email</label>
        <app-input-text v-model="email" id="email1" type="email" class="w-full mb-3" />

        <label for="password1" class="block text-900 font-medium mb-2">Passwort</label>
        <app-input-text v-model="password" id="password1" type="password" class="w-full mb-3" />

        <app-button
          :label="submitButtonText"
          type="submit"
          icon="pi pi-user"
          :loading="isLoading"
          class="w-full"
        ></app-button>
      </form>
    </div>
  </div>
</template>
