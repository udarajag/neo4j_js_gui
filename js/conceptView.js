function initialize(){
    searchByQuery("match (n1:DataRecord)-[r1:relatedPublication]->(n2:Publication) " +
    		"with collect(distinct n1) as n11, collect(distinct n2) as n22, collect(distinct r1) as r11 " +
    		"match (n2)-[r2:researchQuestion]->(n3) " +
    		"with n11,n22,collect(distinct n3) as n33, r11, collect(distinct r2) as r22 " +
    		"match (n3)-[r3:CRC]->(n4) " +
    		"with n11,n22,n33,collect(distinct n4) as n44, r11, r22, collect(distinct r3) as r33 " +
    		"match (n4)-[r4:ofInstance]->(n5) " +
    		"with n11,n22,n33,n44,collect(distinct n5) as n55, r11, r22, r33, collect(distinct r4) as r44 " +
    		"match (n5)-[r5:ofConcept]->(n6) "+
    		"with n11,n22,n33,n44,n55,collect(distinct n6) as n66, r11, r22, r33, r44, collect(distinct r5) as r55 " +
    		"match (n5:ConceptInstance)-[r6:hasVariable]->(n7) "+
    		"with n11,n22,n33,n44,n55,n66,collect(distinct n7) as n77, r11, r22, r33, r44, r55, collect(distinct r6) as r66 " +
    		"return n11,n22,n33,n44,n55,n66,n77,r11,r22,r33,r44,r55,r66 limit 2500");
}