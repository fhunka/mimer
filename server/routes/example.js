export default function (server) {

  const dataCluster = server.plugins.elasticsearch.getCluster('data');

  server.route({
    path: '/api/jag_testar_ett_plugin/example',
    method: 'GET',
    //handler(req, reply) {
    //  reply({ time: (new Date()).toISOString() });
    //}
    handler: function(req, reply) {
		dataCluster.callWithRequest(req,'search',{
			index: "logstash-*",
			size: 10
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			reply({
				ok: true,
				resp: resp
			});
		}).catch(function (resp) {	
			console.error("Error while fetching hosts",resp);
			reply({
				ok: false,
				resp: resp
			});
		});	
		
	}
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries',
    method: 'GET',
    //handler(req, reply) {
    //  reply({ time: (new Date()).toISOString() });
    //}
    handler: function(req, reply) {
                dataCluster.callWithRequest(req,'search',{
                        index: "saved-search",
                        size: 10
                }).then(function (resp) {
                        //console.log(resp);//.aggregations.hosts.buckets);
                        reply({
                                ok: true,
                                resp: resp
                        });
                }).catch(function (resp) {
                        console.error("Error while fetching hosts",resp);
                        reply({
                                ok: false,
                                resp: resp
                        });
                });

        }
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries2',
    method: 'POST',
    //handler(req, reply) {
    //  reply({ time: (new Date()).toISOString() });
    //}
    handler: function(req, reply) {
		console.log("--- req ---");
		console.log(req.payload);
                dataCluster.callWithRequest(req,'index',{
                        index: "saved-search",
			type: "query",
			body: req.payload.params
                }).then(function (resp) {
                        //console.log(resp);//.aggregations.hosts.buckets);
                        reply({
                                ok: true,
                                resp: resp
                        });
                }).catch(function (resp) {
                        console.error("Error while fetching hosts",resp);
                        reply({
                                ok: false,
                                resp: resp
                        });
                });

        }
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries_update',
    method: 'POST',
    //handler(req, reply) {
    //  reply({ time: (new Date()).toISOString() });
    //}
    handler: function(req, reply) {
                console.log("--- req ---");
                console.log(req.payload);
                dataCluster.callWithRequest(req,'update',{
                        index: req.payload.index,
                        type: req.payload.type,
			id: req.payload.id,
                        body: req.payload.body
                }).then(function (resp) {
                        //console.log(resp);//.aggregations.hosts.buckets);
                        reply({
                                ok: true,
                                resp: resp
                        });
                }).catch(function (resp) {
                        console.error("Error while fetching hosts",resp);
                        reply({
                                ok: false,
                                resp: resp
                        });
                });

        }
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries_list',
    method: 'POST',
    //handler(req, reply) {
    //  reply({ time: (new Date()).toISOString() });
    //}
    handler: function(req, reply) {
                console.log("--- req ---");
                console.log(req.payload);
		console.log(JSON.stringify(req.payload.params.sort));

		var tmp = {};
		tmp[req.payload.params.field] = { "order": req.payload.params.direction }

                dataCluster.callWithRequest(req,'search',{
                        index: "saved-search",
			body: {
                        	size: req.payload.params.size,
                        	from: req.payload.params.from * req.payload.params.size,
				sort: req.payload.params.sort //[{req.payload.params.field: {"order": req.payload.params.direction }]
                	}
		}).then(function (resp) {
                        //console.log(resp);//.aggregations.hosts.buckets);
                        reply({
                                ok: true,
                                resp: resp
                        });
                }).catch(function (resp) {
                        console.error("Error while fetching hosts",resp);
                        reply({
                                ok: false,
                                resp: resp
                        });
                });

        }
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries_delete_doc',
    method: 'POST',
    handler: function(req, reply) {
		console.log("--- req --")
		console.log(req.payload);
		dataCluster.callWithRequest(req,'delete',{
			index: req.payload.index,
			type: req.payload.type,
			id: req.payload.id
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			reply({
				ok: true,
				resp: resp
			});
		}).catch(function (resp) {	
			console.error("Error while deleting document",resp);
			reply({
				ok: false,
				resp: resp
			});
		});	
	}
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries_validate',
    method: 'POST',
    handler: function(req, reply) {
		console.log("--- req --")
		console.log(req.payload);
		dataCluster.callWithRequest(req,'indices.validateQuery',{
			index: req.pqyload.index,
			body: req.payload.query
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			reply({
				ok: true,
				resp: resp
			});
		}).catch(function (resp) {	
			console.error("Error while deleting document",resp);
			reply({
				ok: false,
				resp: resp
			});
		});	
	}
  });

  server.route({
    path: '/api/jag_testar_ett_plugin/queries_get',
    method: 'POST',
    handler: function(req, reply) {
		console.log("--- req --")
		console.log(req.payload);
		dataCluster.callWithRequest(req,'get',{
			index: req.payload.index,
			type: req.payload.type,
			id: req.payload.id
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			reply({
				ok: true,
				resp: resp
			});
		}).catch(function (resp) {	
			console.error("Error while deleting document",resp);
			reply({
				ok: false,
				resp: resp
			});
		});	
	}
  });

}
