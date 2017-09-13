function initialize(){
    searchByQuery("match (n1:OntConcept)-[r1]->(n2) return r1,n1,n2 limit 25");
}