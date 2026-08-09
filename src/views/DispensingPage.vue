<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-title>Processing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="dispensing-container">

        <div class="spinner">
          ⚙️
        </div>

        <h1>Dispensing Your Order</h1>

        <p>
          Please wait...
        </p>

      </div>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue'

</script>

<style scoped>

ion-content {
  --background: #f5f5f5;
}

.dispensing-container {

  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  text-align: center;

}

.spinner {

  font-size: 80px;

  margin-bottom: 30px;

}

.dispensing-container h1 {

  font-size: 32px;

}

.dispensing-container p {

  font-size: 20px;

}

</style>