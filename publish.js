var exec = require('child_process').exec;

let command=[
    "git add --all",
    `git commit -m ${new Date().getTime()}`,
    `git push -u origin main`,
    `sam28520\n`
]
async function start(){
    for (const a of command){
     await new Promise((resolve, reject)=>{
         exec(a,
             function (error, stdout, stderr) {
                 console.log('stdout: ' + stdout);
                 console.log('stderr: ' + stderr);
                 if(stderr.includes('Enter')!==-1){
console.log('needEnter')
                     var spawn = require('child_process').spawn;
                     spawn('sh',['sam28520.sh'], { stdio: 'inherit' });
                 }
                 if (error !== null) {
                     console.log('exec error: ' + error);
                     resolve(false)
                 }else{
                     resolve(true)
                 }
             });
     })
    }
}
start()

