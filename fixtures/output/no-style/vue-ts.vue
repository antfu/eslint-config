<script setup lang="ts">
// Define reactive data and props
import { ref } from 'vue';

const greeting = ref('Hello, Vue 3!');
const counter = ref<number  | string>(0);

// Define a function
const incrementCounter = () => {
  counter.value++;
};
</script>

<template>
  <div>
    <h1>{{ greeting }}</h1>
    <button @click="incrementCounter">
      Click me!
    </button>
    <p>Counter: {{ counter }}</p>
  </div>
</template>
