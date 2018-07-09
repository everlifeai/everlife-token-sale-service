/*      problem/
 * Javascript's type system does not help us with mis-spellings, typos,
 * and mistakes when comparing values even at run-time. For example,
 * if we stored the value "NeedInput" and compare it (mistakenly) with
 * "NeedsInput) it would never succeed.
 *
 *      way/
 * Unit testing helps in catching these types of errors, but a simpler
 * first step is to use a typed reference to refer to the value wherever
 * it is used (at least helps with catching spelling errors and renaming etc).
 */
module.exports = {
    'SUCCESS': 'SUCCESS',
    'FAILED': 'FAILED'
}
