function initialize(){
    searchByQuery("match (n1:DataRecord)-[r1:ofDemConcInst]->(n2), (n2)-[r2:ofDemConcept]->(n3) return r1,r2,n1,n2,n3 limit 2500");
}