from __future__ import print_function
# https://www.freeformatter.com/json-escape.html
import logging
import json
import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers
#from dateutil.parser import parse as parse_date

es = Elasticsearch(["localhost"])

def print_search_stats(results):
    print('=' * 80)
    print('Total %d found in %dms' % (results['hits']['total'], results['took']))
    print('-' * 80)

def print_hits(results):
    " Simple utility function to print results of a search query. "
    print_search_stats(results)
    for hit in results['hits']['hits']:
        # get created date for a repo and fallback to authored_date for a commit
        #created_at = parse_date(hit['_source'].get('created_at', hit['_source']['authored_date']))
        print('/%s/%s/%s - %s\n%s' % (
                hit['_index'], hit['_type'], hit['_id'], hit['_source']['name'], hit['_source']['query']))
                #created_at.strftime('%Y-%m-%d'),
                #hit['_source']['description'].split('\n')[0]))

    print('=' * 80)

ss_to_json_query={
	'query': {
		'bool': {
			'must': [
				{
					"term": {
						"active": {
							"value": True
						}
					}
				}
			]
		}
	}
}
#count = es.count(index='saved-search',doc_type='',body=ss_to_json_query)
#print('Find all saved searches', count['count'])
#result = es.search(index='saved-search',doc_type='',body=ss_to_json_query)
#print_hits(result)

# Use scan instead because we can have more then the default 10 hits returned
result = helpers.scan(es, query=ss_to_json_query,index="saved-search",doc_type="query")
#for hits in result:
#	print(hits)

actions = []
updates = []

print('Iterate all found ACTIVE saved searches')
print('-' * 80)

result_count = 0

for hit in result:
	
	#print(json.dumps(hit_w,sort_keys=True,indent=2))
	
	alert = {
		"_op_type": "index",
		"_index": "alerts-" + datetime.datetime.utcnow().strftime('%Y.%m.%d'),
		"_type": "notification",
		"_source": {
			"type": "alert",
			"timestamp": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
			"name": hit["_source"]["name"]
		}
	}
	
	# Repeating saved search
	tmp_scheduled = False
	tmp_active = True
	if hit['_source']['scheduled']:
		tmp_scheduled = True
	else:
		tmp_active = False
		
	# Only run the saved search once unless scheduled
	update = {
		"_op_type": "update",
		"_index": hit["_index"],
		"_type": hit["_type"],
		"_id": hit["_id"],
		"doc": {
			"ran_at": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
			"scheduled": tmp_scheduled,
			"active": tmp_active
		}
	}
		
	#t = es.indices.validate_query(index='*', doc_type='', body=hit['_source']['query'])
	#if t["valid"]:
	if hit['_source']['valid']:
		print('Execute all if valid query')
		#ss = es.search(index='logstash-*', doc_type='event', body=hit['_source']['query'])
		ss = es.search(index='logstash-*', body=hit['_source']['query'])
		print(datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'), hit["_source"]["name"], json.dumps(ss))
		alert["_source"]["result"] = ss
		#for hit_w in w['hits']['hits']:
		#	print(json.dumps(hit_w,sort_keys=True,indent=2))
		#print(json.dumps(ss,sort_keys=True,indent=2))
	else:
		alert["_source"]["result"] = {}
		print(hit["_source"]["name"], t)
		
	#alert["_source"]["validation"] = t
	#print(json.dumps(alert,sort_keys=True,indent=2))
	actions.append(alert)
	actions.append(update)
	result_count += 1
	print('-' * 80)

notification = {
		"_op_type": "index",
		"_index": "alerts-" + datetime.datetime.utcnow().strftime('%Y.%m.%d'),
		"_type": "notification",
		"_source": {
			"timestamp": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
			"name": "Run Saved Searches",
			"message": "Script ran successfully",
			"type": "notification",
			"result": {
				"hits": {
					"total": result_count
				}
			}
		}
}

actions.append(notification)
if actions: 	
	helpers.bulk(es, actions)
