import { modalController } from "@ionic/vue";

export function openModal(component: any, props: any) {
  return async function () {
    const modal = await modalController.create({
      component: component,
      componentProps: props,
    });
    return modal.present();
  };
}
