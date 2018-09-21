README
https://www.freeformatter.com/json-escape.html

/kibana
yarn es snapshot

/kibana
node scripts/makelogs

kibana-extra/mimer
yarn start

kibana-extra/mimer
git pull

--- Purpose ---
Save a query

Cron pulls queries and procudces output

Verify output

Create case manually or automatic

Create Case overview with basic stats

Allow export of events

# Issues - Manual, automatic triggered alerts with highlight
/issues/doc/
{
	"name": "",
	"created_at": "",
	"type": "",
	"triggers": []
}
# Triggers - Current jobs, history.
/triggers/doc/
{
	"name": "",
	"hits": {
		"hits": {
			"total": ""
		}
	}
	
}
# Usecase - Defines x queries
/usecases/doc/
{
	"name": "",
	"queries": [],
	"type": "",
	"description": "",
	"dependencies": [] # Get list of sources from events
	"mitigation": [
		{
			"name": "",
			"description": ""
		},
		{	"name": "",
			"description": ""
		}
	]
}
# - Queries - Pulls data for jobs, based on usecase triggers
# - Chained queries, based on result from previous resultset
/queries/doc/
{
	"name":  "",
	"query": "",
	"type": "",
	"scope": "" # What to return from the query, result set or values for more chained queries
}

Get all usecases
	Execute all queries
		Create triggers for the usecase
			Manual/Automatic Issue creation
			
Create Issue
	Based on timeframe, create a insight based on trigger
	