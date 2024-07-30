<template>
  <div class="card flex justify-content-center">
    <app-chart type="doughnut" :data="chartData" :options="chartOptions" class="w-6 md:w-[30rem]" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'

interface ChartData {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
    hoverBackgroundColor: string[]
  }[]
}

interface ChartOptions {
  plugins: {
    legend: {
      labels: {
        color: string
      }
    }
  }
  cutout: string
}

const chartData = ref<ChartData | null>(null)
const chartOptions = ref<ChartOptions | null>(null)
const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean) => {
  let q = query(
    collection(db, 'users', userStore.userId, 'interviews'),
    orderBy('createdAt', 'desc')
  )
  const listDocs = await getDocs(q)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const setChartData = (interviews: IInterview[]): ChartData => {
  const documentStyle = getComputedStyle(document.body)

  const data = [0, 0, 0]
  interviews.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Reject') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ['Offer', 'Refusal', 'In progress'],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500') || '#00bcd4',
          documentStyle.getPropertyValue('--p-orange-500') || '#ff9800',
          documentStyle.getPropertyValue('--p-gray-500') || '#9e9e9e'
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400') || '#26c6da',
          documentStyle.getPropertyValue('--p-orange-400') || '#ffa726',
          documentStyle.getPropertyValue('--p-gray-400') || '#bdbdbd'
        ]
      }
    ]
  }
}

const setChartOptions = (): ChartOptions => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    cutout: '60%'
  }
}

onMounted(async () => {
  interviews.value = await getAllInterviews()
  chartData.value = setChartData(interviews.value)
  chartOptions.value = setChartOptions()
})
</script>
