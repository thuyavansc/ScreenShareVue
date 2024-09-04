<!-- <template>
  <div class="dashboard">
    <DeviceList />
    <ScreenShareView v-if="selectedDevice.username" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceList from "@/components/DeviceList.vue";
import ScreenShareView from "@/components/ScreenShareView.vue";
import { useDeviceStore } from "@/store/deviceStore";

export default defineComponent({
  components: {
    DeviceList,
    ScreenShareView,
  },
  setup() {
    const deviceStore = useDeviceStore();

    return {
      selectedDevice: deviceStore.selectedDevice,
    };
  },
});
</script> -->

<template>
  <div class="dashboard">
    <div class="peer-request">
      <!-- ShadCN Textbox and Button -->
      <input
        v-model="peerUsername"
        type="text"
        class="input"
        placeholder="Enter Peer Username"
      />
      <button class="button" @click="onRequestScreenShare">Watch Screen</button>
    </div>

    <DeviceList />
    <ScreenShareView v-if="selectedDevice.username" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { requestScreenShare as sendScreenShareRequest } from "@/services/websocketService";
import DeviceList from "@/components/DeviceList.vue";
import ScreenShareView from "@/components/ScreenShareView.vue";
import { useDeviceStore } from "@/store/deviceStore";

export default defineComponent({
  components: {
    DeviceList,
    ScreenShareView,
  },
  setup() {
    const deviceStore = useDeviceStore();
    const peerUsername = ref("");

    const onRequestScreenShare = () => {
      if (peerUsername.value) {
        // Call the actual WebSocket function from websocketService.ts
        sendScreenShareRequest(peerUsername.value);
      } else {
        console.error("No peer username provided");
      }
    };

    return {
      peerUsername,
      onRequestScreenShare,
      selectedDevice: deviceStore.selectedDevice,
    };
  },
});
</script>

<style scoped>
.peer-request {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
}

.button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>
