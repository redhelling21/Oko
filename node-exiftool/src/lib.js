const cp = require('child_process')
const EOL = require('os').EOL

function writeStdIn(proc, data, encoding) {
    // console.log('write stdin', data)
    proc.stdin.write(data, encoding)
    proc.stdin.write(EOL, encoding)
}

function close(proc) {
    return new Promise((resolve) => {
        proc.on('close', resolve)
        writeStdIn(proc, '-stay_open')
        writeStdIn(proc, 'false')
    })
}

function isString(s) {
    return (typeof s).toLowerCase() === 'string'
}

/**
 * Get arguments. Split by new line to write to exiftool
 */
function getArgs(args, noSplit) {
    if(!(Array.isArray(args) && args.length)) {
        return []
    }
    return args
        .filter(isString)
        .map(arg => `-${arg}`)
        .reduce((acc, arg) =>
            [].concat(acc, noSplit ? [arg] : arg.split(/\s+/))
        , [])
}

/**
 * Write command data to the exiftool's stdin.
 * @param {ChildProcess} process - exiftool process executed with -stay_open True -@ -
 * @param {string} command - which command to execute
 * @param {string} commandNumber - text which will be echoed before and after results
 * @param {string[]} args - any additional arguments
 * @param {string[]} noSplitArgs - arguments which should not be broken up like args
 * @param {string} encoding - which encoding to write in. default no encoding
 */
function execute(proc, command, commandNumber, args, noSplitArgs, encoding) {
    const extendedArgs = getArgs(args)
    const extendedArgsNoSplit = getArgs(noSplitArgs, true)

    command = command !== undefined ? command : '';

    [].concat(
        extendedArgsNoSplit,
        extendedArgs,
        ['-json', '-s'],
        [
            command,
            '-echo1',
            `{begin${commandNumber}}`,
            '-echo2',
            `{begin${commandNumber}}`,
            '-echo4',
            `{ready${commandNumber}}`,
            `-execute${commandNumber}`,
        ]
    )
        .forEach(arg => writeStdIn(proc, arg, encoding))
}

var previous = 0;

function genCommandNumber() {
    var date = Date.now();
    // If created at same millisecond as previous
    if (date <= previous) {
        date = ++previous;
    } else {
        previous = date;
    }
    return String(date);
}

function executeCommand(proc, stdoutRws, stderrRws, command, args, noSplitArgs, encoding) {
    const commandNumber = genCommandNumber()

    if (proc === process) { // debugging
        execute(proc, command, commandNumber, args, noSplitArgs, encoding)
        return Promise.resolve({ data: 'debug', error: null })
    }

    const dataPromise = new Promise(resolve => {
        stdoutRws.addToResolveMap(commandNumber, resolve)
    })
    const errPromise = new Promise(resolve =>
        stderrRws.addToResolveMap(commandNumber, resolve)
    )

    execute(proc, command, commandNumber, args, noSplitArgs, encoding)

    return Promise.all([
        dataPromise,
        errPromise,
    ])
        .then(res => ({
            data: res[0] ? JSON.parse(res[0]) : null,
            error: res[1] || null,
        }))
}

function spawn(bin) {
    return new Promise((resolve, reject) => {
        const echoString = Date.now().toString()
        const process = cp.spawn(bin, ['-echo2', echoString, '-stay_open', 'True', '-@', '-'])
        process.once('error', reject)
        const echoHandler = (data) => {
            const d = data.toString().trim()
            // listening for echo2 in stderr (echo and echo1 won't work)
            if (d === echoString) {
                resolve(process)
            } else {
                reject(new Error(`Unexpected string on start: ${d}`))
            }
        }
        process.stderr.once('data', echoHandler)
    })
}

function checkDataObject(data) {
    return data === Object(data) && !Array.isArray(data)
}

function mapDataToTagArray(data, array) {
    const res = Array.isArray(array) ? array : []
    Object
        .keys(data)
        .forEach(tag => {
            const value = data[tag]
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    const arg = `${tag}=${v}`
                    res.push(arg)
                })
            } else {
                res.push(`${tag}=${value}`)
            }
        })
    return res
}

module.exports = {
    spawn,
    close,
    executeCommand,
    checkDataObject,
    mapDataToTagArray,
    getArgs,
    execute,
    isString,
}
