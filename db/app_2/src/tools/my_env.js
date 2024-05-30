import ENV from '../../public/env.json'

export function public_id() {
    return ENV.app.env.public_id
}