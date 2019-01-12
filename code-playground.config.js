module.exports = {
  // server port
  port: 3000,

  // title
  title: "s-spring-snap-component",

  // layout
  layout: "right",

  // compile server
  compileServer: {
    // compile server port
    port: 4000
  },

  // editors
  editors: {
    html: {
      language: "html",
      data: `
        <s-spring-snap snap-distance="50" max-translate="30">
          <button class="btn btn--primary">
            I will be snaped to the mouse
          </button>
        </s-spring-snap>
      `
    },
    css: {
      language: "scss",
      data: `
        @import 'node_modules/coffeekraken-sugar/index';
        @import 'node_modules/coffeekraken-s-button-component/index';

        @include s-setup(());
        @include s-init();
        @include s-classes();

        @include s-button-classes();

        body {
          padding: s-space(bigger);
        }
      `
    },
    js: {
      language: "js",
      data: `
        import SSpringSnapComponent from './dist/index'
      `
    }
  }
}
