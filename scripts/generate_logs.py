import random
import datetime
import logging
import logging.handlers

logger = logging.getLogger('MyLogger')
logger.setLevel(logging.DEBUG)

handler = logging.handlers.SysLogHandler(address = ('127.0.0.1',1514))

logger.addHandler(handler)

#TODO: [a-zA-Z]{3}[a-zA-Z]{4}\d{3}[a-zA-Z]{3}[a-zA-Z]{2} # 15 characters!!!
#TODO: <environment><component><type><number><server,type w|l v|p>
#TODO: abcABCDabc000wp else exception and handled by internal it... ie prod BLCO dbt 001 wp for a physical windows handling the db for a bluecoat

environment = ["dev", "pro", "tes"]
component = ["abcd", "efgh", "ijkl", "mnop"]
e_type = ["dbs","dbo","asd"]
os = ["l", "w"]
server_type = ["v", "p"]

def hostname():
  #print len(os)-1
  e = environment[random.randint(0,len(environment)-1)]
  c = component[random.randint(0,len(component)-1)]
  et = e_type[random.randint(0,len(e_type)-1)]
  inventory_id = "%03d" % (random.randint(1,101))
  host = "%s%s" % (os[random.randint(0,len(os)-1)],server_type[random.randint(0,len(server_type)-1)])
  return "%s%s%s%s%s" % (e,c,et,inventory_id,host)

for x in range(10):
  logger.debug("%s %s asd123" %(datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),hostname()))