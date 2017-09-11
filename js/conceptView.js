function initialize(){
    searchByQuery("match (n1:DataRecord)-[r1:relatedPublication]->(n2),(n2)-[r2:researchQuestion]->(n3),(n3)-[r3:CRC]->(n4)," +
    		"(n4)-[r4:ofInstance]->(n5),(n5)-[r5:ofConcept]->(n6) return r1,r2,r3,r4,r5,n1,n2,n3,n4,n5,n6 limit 2500");
}