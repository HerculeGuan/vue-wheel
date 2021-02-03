<template>
  <div class="toast">
    <slot></slot>
    <template v-if="closeButton">
      <div class="line"></div>
      <span class="close" @click="onClickClose">{{
        closeButton.text
      }}</span></template
    >
  </div>
</template>

<script>
export default {
  name: "GToast",
  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
    autoCloseDelay: {
      type: Number,
      default: 5,
    },
    closeButton: {
      type: Object,
      default() {
        return {
          text: "关闭",
          callback: undefined,
        };
      },
    },
  },
  mounted() {
    if (this.autoClose) {
      setTimeout(() => {
        this.close();
      }, this.autoCloseDelay * 1000);
    }
  },
  methods: {
    close() {
      this.$el.remove();
      this.$destroy();
    },
    onClickClose() {
      this.close();
      if (this.closeButton && typeof this.closeButton.callback === "function") {
        this.closeButton.callback(this);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font-size: 14px;
$toast-height: 40px;
$toast-border-radius: 4px;
$toast-bg: rgba(0, 0, 0, 0.75);
.toast {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: $font-size;
  line-height: 1.8;
  height: $toast-height;
  display: flex;
  align-items: center;
  color: white;
  background: $toast-bg;
  border-radius: $toast-border-radius;
  box-shadow: 0 0 3 0 rgba(0, 0, 0, 0.5);
  padding: 0 16px;
  .close {
    padding-left: 16px;
  }
  .line {
    height: 100%;
    border-left: 1px solid #666;
    margin-left: 16px;
  }
}
</style>