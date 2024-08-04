import { createApp } from 'vue'
import App from './views/App.vue'
import '@/assets/index.css'


export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. Set cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'explorer-search',
      position: 'inline',
      onMount: (container) => {
        // Define how your UI will be mounted inside the container
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount();
      },
    });

    // 4. Mount the UI
    ui.mount();
  },
});

// let url_prec = window.location.href
// window.setInterval(() => {
//   if (!document.getElementById('explorer-xiaoshu')) {
//     if (url_prec !== window.location.href) {
//       url_prec = window.location.href
//       init()
//     }
//   }
// }, 1000)


