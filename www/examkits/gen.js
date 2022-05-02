let dlRoot = "https://raw.githubusercontent.com/Academy-of-Learning-Career-College/exam-prep-files/main/"
let suffix = "Practical_Exam_Kit.zip"
let coursesArray = [
    {"course" : "WRD", "courseName" : "Word", "ver" : 19, "level" : [
        1,2,3
    ]},
    {"course" : "EXC", "courseName" : "Excel","ver" : 19, "level" : [
        1,2,3
    ]},
    {"course" : "PPT","courseName" : "PowerPoint", "ver" : 19, "level" : [
        1,2
    ]},
    {"course" : "ACS", "courseName" : "Access", "ver" : 19, "level" : [
        1,2
    ]},
]

coursesArray.forEach(element => {
    concat = `${element.course}/${element.ver}`;
    // console.log(element.course);
    // console.log(element.ver);
    coursename1 = `Microsoft ${element.courseName} 2019 Level `
    element.level.forEach(element => {
        concatlevel = `${concat}/${element}`
        link = `${dlRoot}${concatlevel}/${suffix}`
        
        aRef = `<a href="${concatlevel}">${coursename1}${element}</a><br>`
        document.write(aRef)
        console.log(concatlevel);
    })
});