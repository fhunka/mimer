import Boom from 'boom';

export default function (server) {

  const dataCluster = server.plugins.elasticsearch.getCluster('data');
  
  function createIndice(new_indice, new_mappings){
		dataCluster.callWithRequest({},'indices.create',{
			index: new_indice,
      body: new_mappings
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			//reply({
			//	ok: true,
			//	resp: resp
			//});
      console.log("AMAGADAJAJSDJASDJAJDSJAJSDJJASJASJD");
      console.log(resp);
		}).catch(function (resp) {	
			console.error("Error while fetching hosts",resp);
			//reply({
			//	ok: false,
			//	resp: resp
			//});
      console.log(Boom.notFound());
      console.log(resp);
		});
  }
  
  function verifyIndice(verify_indice) {
    
		dataCluster.callWithRequest({},'indices.exists',{
			index: verify_indice
		}).then(function (resp) {
			//console.log(resp);//.aggregations.hosts.buckets);
			//reply({
			//	ok: true,
			//	resp: resp
			//});
      if (resp==false){
        createIndice(verify_indice);
      }

		}).catch(function (resp) {	
			console.error("Error while fetching hosts",resp);
			//reply({
			//	ok: false,
			//	resp: resp
			//});
      console.log(Boom.notFound());
      console.log(resp);
		});
    
  }
  
  //Verify that the index exists
  //mimer/doc/settings
  //mimer/doc/queries
  //mimer/doc/issues
  const mimer_mappings = {
    "settings": {},
    "mapptings": {}
  };
  verifyIndice("mimer", mimer_mappings);
  
  const queries_mappings = {
    "settings": {},
    "mapptings": {
      "doc": {
              "properties": {
                "active": {
                  "type": "boolean"
                },
                "datetime": {
                  "type": "date"
                },
                "index": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "name": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "query": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "scheduled": {
                  "type": "boolean"
                },
                "severity": {
                  "type": "text",
                  "fields": {
                    "keyword": {
                      "type": "keyword",
                      "ignore_above": 256
                    }
                  }
                },
                "timestamp": {
                  "type": "long"
                },
                "updated_at": {
                  "type": "date"
                },
                "valid": {
                  "type": "boolean"
                }
              }
            }
    }
  };
  verifyIndice("queries", queries_mappings);
  
  const issues_mappings = {
    "settings": {},
    "mapptings": {}
  };
  verifyIndice("issues", issues_mappings);

}
