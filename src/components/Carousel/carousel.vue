<template>
  <div
    class="et-carousel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="et-carousel-window">
      <div class="et-carousel-wrapper">
        <slot />
        <template v-if="indicatorVisible">
          <span @click="clickPrevious" class="et-carousel-icon left">
            <et-icon name="left"></et-icon>
          </span>
          <span @click="clickNext" class="et-carousel-icon right">
            <et-icon name="right"></et-icon>
          </span>
        </template>
      </div>
    </div>

    <div class="et-carousel-dots">
      <span
        v-for="n in childrenLength"
        :class="{ active: n - 1 === selectedIndex }"
        @[triggerEvent]="select(n - 1)"
        :data-index="n"
      ></span>
    </div>
  </div>
</template>

<script>
import Icon from "../Icon/icon";
export default {
  name: "EtCarousel",
  props: {
    selected: {
      type: [String, Number],
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    autoPlayDelay: {
      type: Number,
      default: 1000,
    },
    playReverse: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: String,
      default: "click",
      validator(value) {
        return ["click", "hover"].indexOf(value) >= 0;
      },
    },
  },
  data() {
    return {
      childrenLength: 0,
      lastSelectedIndex: undefined,
      timerId: undefined,
      startTouch: undefined,
      indicatorVisible: false,
    };
  },
  components: {
    "et-icon": Icon,
  },
  methods: {
    getSelected() {
      return this.selected || this.items[0].name;
    },
    onMouseEnter() {
      this.indicatorVisible = true;
      this.pause();
    },
    onMouseLeave() {
      this.indicatorVisible = false;
      this.playAutomatically();
    },
    onTouchStart(e) {
      this.pause();
      if (e.touches.length > 1) {
        return;
      }
      this.startTouch = e.touches[0];
    },
    onTouchEnd(e) {
      let endTouch = e.changedTouches[0];
      let { clientX: x1, clientY: y1 } = this.startTouch;
      let { clientX: x2, clientY: y2 } = endTouch;
      let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      let deltaY = Math.abs(y2 - y1);
      let rate = distance / deltaY;
      if (rate > 2) {
        if (x2 > x1) {
          this.clickPrevious();
        } else {
          this.clickNext();
        }
      }
      this.$nextTick(() => {
        this.playAutomatically();
      });
    },
    clickPrevious() {
      this.select(this.selectedIndex - 1);
    },
    clickNext() {
      this.select(this.selectedIndex + 1);
    },
    playAutomatically() {
      if (!this.autoPlay) {
        return;
      }
      if (this.timerId) {
        return;
      }
      let run = () => {
        let index = this.names.indexOf(this.getSelected());
        this.timerId = setTimeout(() => {
          let newIndex = this.playReverse ? index - 1 : index + 1;
          this.select(newIndex);
          run();
        }, this.autoPlayDelay);
      };
      run();
    },
    pause() {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    },
    updateChildren() {
      let selected = this.getSelected();
      this.items.forEach((vm) => {
        let reverse =
          this.selectedIndex > this.lastSelectedIndex ? false : true;
        if (
          this.lastSelectedIndex === this.childrenLength - 1 &&
          this.selectedIndex === 0
        ) {
          reverse = false;
        }
        if (
          this.lastSelectedIndex === 0 &&
          this.selectedIndex === this.childrenLength - 1
        ) {
          reverse = true;
        }
        vm.reverse = reverse;
        this.$nextTick(() => {
          vm.selected = selected;
        });
      });
    },
    select(index) {
      if (index === -1) {
        index = this.names.length - 1;
      }
      if (index === this.names.length) {
        index = 0;
      }
      this.lastSelectedIndex = this.selectedIndex;

      this.$emit("update:selected", this.names[index]);
    },
  },
  computed: {
    selectedIndex() {
      return this.names.indexOf(this.getSelected()) || 0;
    },
    names() {
      return this.items.map((vm) => vm.name);
    },
    items() {
      return this.$children.filter(
        (vm) => vm.$options.name === "EtCarouselItem"
      );
    },
    triggerEvent() {
      if (this.trigger === "hover") {
        return "mouseenter";
      } else {
        return "click";
      }
    },
  },
  mounted() {
    this.updateChildren();
    this.playAutomatically();
    this.childrenLength = this.items.length;
    this.lastSelectedIndex = this.selectedIndex;
  },
  updated() {
    this.updateChildren();
  },
};
</script>

<style lang="scss" scoped>
@import "../var";

.et-carousel {
  &-window {
    overflow: hidden;
  }
  &-wrapper {
    position: relative;
    > .et-carousel-icon {
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 32px;
      cursor: pointer;
      fill: $grey;
      &.left {
        left: 5%;
      }
      &.right {
        right: 5%;
      }
    }
  }
  &-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      cursor: pointer;
      margin: 0.2em 0.5em;
      display: inline-flex;
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      background-color: $grey;
      &.active {
        background-color: $primary-color;
        // cursor: default;
      }
    }
  }
}
</style>
