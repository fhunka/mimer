import exampleRoute from './server/routes/example';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'jag-testar-ett-plugin',
    uiExports: {
      
      app: {
        title: 'Jag Testar Ett Plugin',
        description: 'a test',
        main: 'plugins/jag-testar-ett-plugin/app',
        
        styleSheetPath: require('path').resolve(__dirname, 'public/app.scss'),
        
      },
      
      
      hacks: [
        'plugins/jag-testar-ett-plugin/hack'
      ]
      
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    
    init(server, options) {
      // Add server routes and initialize the plugin here
      exampleRoute(server);
    }
    

  });
};
