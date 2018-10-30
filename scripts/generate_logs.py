import random
import datetime
import logging
import logging.handlers
import json
import sys

# pip install elasticsearch, requests
from elasticsearch import Elasticsearch
from elasticsearch import helpers
from elasticsearch.connection import RequestsHttpConnection


logger = logging.getLogger('MyLogger')
logger.setLevel(logging.DEBUG)

handler = logging.handlers.SysLogHandler(address = ('127.0.0.1',1514))

logger.addHandler(handler)

#TODO: [a-zA-Z]{3}[a-zA-Z]{4}\d{3}[a-zA-Z]{3}[a-zA-Z]{2} # 15 characters!!!
#TODO: <environment><component><type><number><server,type w|l v|p>
#TODO: abcABCDabc000wp else exception and handled by internal it... ie prod BLCO dbt 001 wp for a physical windows handling the db for a bluecoat

es = Elasticsearch(["localhost"],connection_class=RequestsHttpConnection)

generated_logs = []

environment = ["dev", "pro", "tes"]
component = ["abcd", "efgh", "ijkl", "mnop"]
e_type = ["dbs","dbo","asd"]
os = ["l", "w"]
server_type = ["v", "p"]

secure_random = random.SystemRandom()

def hostname():
  #print len(os)-1
  e = secure_random.choice(environment)
  c = secure_random.choice(component)
  et = secure_random.choice(e_type)
  inventory_id = "%03d" % (random.randint(1,101))
  host = "%s%s" % (secure_random.choice(os),secure_random.choice(server_type))
  return "%s%s%s%s%s" % (e,c,et,inventory_id,host)

for x in range(10):
  #logger.debug("%s %s asd123" %(datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),hostname()))
  #print("%s %s asd123" %(datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),hostname()))
  notification = {
    "_op_type": "index",
    "_index": "logstash-" + datetime.datetime.utcnow().strftime('%Y.%m.%d'),
    "_type": "doc",
    "_source": {
      "tags": ["syslog"],
      "timestamp": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
      "hostname": hostname(),
      "message": "Random rant",
      "translate_host": {
        "environment" : {
          "id": "value"
        },
        "component": {
          "id": "value"
        },
        "enviroment_type": {
          "id": "value"
        },
        "os": {
          "id": "value"
        },
        "server_type": {
          "id": "value"
        }
      },
      "translate_categories": ["fw","external"]
    }
  }
  generated_logs.append(notification)
  
#print(json.dumps(generated_logs, indent=2, sort_keys=True))

#sys.exit()
if generated_logs:
  try:
    helpers.bulk(es, generated_logs)
  except:
    print("error")

ss_to_json_query={
	'query': {
		'match_all': {}
	}
}

try:
  result = helpers.scan(es, query=ss_to_json_query,index="logstash-*",doc_type="doc")
  for hit in result:
    print(json.dumps(hit, indent=2, sort_keys=True))
except:
  print("Error search")