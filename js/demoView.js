function initialize(){
    searchByQuery("match (n1:DataRecord)-[r1:hasVariable]->(n2), (n2)-[r2:instanceOf]->(n3) return r1,r2,n1,n2,n3 limit 2500");
}