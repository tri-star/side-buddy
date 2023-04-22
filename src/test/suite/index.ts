import * as path from 'path'
import * as Mocha from 'mocha'
import { globSync } from 'glob'

// eslint-expect-error
export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  })

  const testsRoot = path.resolve(__dirname, '..')

  await new Promise((resolve, reject) => {
    globSync('**/**.test.js', { cwd: testsRoot }).forEach(
      (evalue, index, files) => {
        // Add files to the test suite
        files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

        try {
          // Run the mocha test
          mocha.run((failures) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`))
            } else {
              // @ts-expect-error これから対応
              resolve()
            }
          })
        } catch (err) {
          console.error(err)
          reject(err)
        }
      }
    )
  })
}
