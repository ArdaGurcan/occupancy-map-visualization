import bagpy
from bagpy import bagreader
import csv 
import json 

b = bagreader('only-costmap.bag')

# get the list of topics
csvFilePath = b.message_by_topic("/move_base/local_costmap/costmap")

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array
            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray)
        jsonf.write(jsonString)
          

jsonFilePath = r'data.json'
csv_to_json(csvFilePath, jsonFilePath)
