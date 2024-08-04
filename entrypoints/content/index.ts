import { createApp } from 'vue'
import App from './views/App.vue'
import '@/assets/index.css'
import Test from './views/Test.vue'

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
    
    // remount
    let url_prec = window.location.href
    window.setInterval(() => {
      if (!document.querySelector('explorer-search')) {
        if (url_prec !== window.location.href) {
          url_prec = window.location.href
          console.log('[NEX] remount',url_prec)
          ui.mount();
        }
      }
    }, 1000)
  },
});




