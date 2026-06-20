import {promises as fs} from 'fs-extra';

export function loadFile (path: string): Promise<string> {
    return fs.readFile(
        path,
        'utf-8'
    )
}