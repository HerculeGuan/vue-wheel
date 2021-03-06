import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { mount } from "@vue/test-utils";
chai.use(sinonChai);

import Button from "@/components/Button/button";

describe("Button", () => {
  it("存在", () => {
    expect(Button).to.exist;
  });

  it("可以设置icon", () => {
    const wrapper = mount(Button, {
      propsData: {
        icon: "setting",
      },
    });
    const useElement = wrapper.find("use");
    expect(useElement.attributes("href")).to.equal("#i-setting");
  });

  it("可以设置loading", () => {
    const wrapper = mount(Button, {
      propsData: {
        icon: "setting",
        loading: true,
      },
    });
    const useElements = wrapper.findAll("use");
    expect(useElements.length).to.equal(1);
    expect(useElements.at(0).attributes("href")).to.equal("#i-loading");
  });

  xit("icon 默认的 order 是 1", () => {
    const wrapper = mount(Button, {
      attachToDocument: true,
      propsData: {
        icon: "setting",
      },
    });
    const vm = wrapper.vm;
    const icon = vm.$el.querySelector("svg");
    expect(getComputedStyle(icon).order).to.eq("1");
  });

  xit("设置 iconPosition 可以改变 order", () => {
    const wrapper = mount(Button, {
      attachToDocument: true,
      propsData: {
        icon: "setting",
        iconPosition: "right",
      },
    });
    const vm = wrapper.vm;
    const icon = vm.$el.querySelector("svg");
    expect(getComputedStyle(icon).order).to.eq("2");
  });

  it("点击 button 触发 click 事件", () => {
    const wrapper = mount(Button, {
      propsData: {
        icon: "setting",
      },
    });
    const callback = sinon.fake();
    wrapper.vm.$on("click", callback);
    wrapper.trigger("click");
    expect(callback).to.have.been.called;
  });
});
