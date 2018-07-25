from __future__ import print_function
# https://www.freeformatter.com/json-escape.html
import logging
import json
import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers
#from dateutil.parser import parse as parse_date

#es = Elasticsearch(["172.20.10.3"])
es = Elasticsearch(["http://localhost"])

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

# Filter to find the latest alerts and create an issue from it
ss_to_json_query={
	'query': {
		'bool': {
			'must': [
				{
					"term":{
						"type": "alert"
					}
				},
				{
					"range": {
						"timestamp": {
							"gte": "now-1d",
							"lte": "now"
						}
					}
				}
			]
		}
	}
}

# Use scan instead because we can have more then the default 10 hits returned
result = helpers.scan(es, query=ss_to_json_query,index="alerts-*",doc_type="notification")
#for hits in result:
#	print(hits)

actions = []
updates = []

print('Iterate all saved searches')
print('-' * 80)

result_count = 0

for hit in result:
	
	print( json.dumps(hit, sort_keys=True, indent=2) )
	print('-' * 80)

	issue = {
		"_op_type": "index",
		"_index": "issues-" + datetime.datetime.utcnow().strftime('%Y.%m.%d'),
		"_type": "doc",
		"_source": {
			"indicator": {
				"id": hit["_id"],
				"index": hit["_index"]
			},
			"timestamp": datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
			"name": "Issue",
			"message": "Script ran successfully",
			"type": "generated",
			"result": {
				"hits": {
					"total": hit["_source"]["result"]["hits"]["total"]
				}
			}
		}
	}

	print(json.dumps(issue, sort_keys=True, indent=2))
	actions.append(issue)
	
if actions: 	
	helpers.bulk(es, actions)

