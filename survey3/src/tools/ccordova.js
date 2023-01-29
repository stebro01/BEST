

export function write_csv(filename, data_csv) {

    console.log('write_csv')
    return new Promise((res, rej) => resolveURL(filename, data_csv).then(result => res(result)))
}
function fail(error) {
    // console.log(error)
}

function resolveURL(filename, data) {
    var storageLocation = cordova.file.documentsDirectory
    return new Promise((res, rej) => window.resolveLocalFileSystemURL(storageLocation, 
        (entry, $filename, $data)=>gotFS(entry, filename, data).then(result=>res(result)),
        fail))
}

function gotFS(fileSystem, fn, data) {
    // console.log('gotFS')
    return new Promise((res, rej) => fileSystem.getDirectory("Downloads", {create: true, exclusive: false}, 
    (dirEntry, $$fn, $data)=>gotDir(dirEntry, fn, data).then(result => res(result)), 
    fail));
}

function gotDir(dirEntry, filename, data) {
    // console.log('gotDir')
    return new Promise((res, rej) => dirEntry.getFile(filename, {create: true, exclusive: false}, 
        (file, $data)=>gotFile(file, data).then(result => res(result)), 
        fail));
}

function gotFile(fileEntry, data) {
    // Start FileTransfer here...
    // console.log('gotFile')
    // console.log(fileEntry)
    
    return new Promise((res,rej) => fileEntry.createWriter(fileWriter => {

        fileWriter.write(data)
        var outname = fileEntry.nativeURL

        res(outname)

    }))
    
}