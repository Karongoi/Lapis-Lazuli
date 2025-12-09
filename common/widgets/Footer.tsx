import { MailIcon, PhoneIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <section className="bg-background border-t border-primary mt-12">
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-start gap-8 p-8'>
                <div className="flex flex-col items-start justify-start gap-2 md:gap-8 md:pl-8">
                    {/* Left: Logo */}
                    <Link href="/" className="flex-shrink-0 h-12 w-full">
                        <Image
                            src="/logo.png"
                            alt="Lapis Lazuli Threads Logo"
                            width={160}
                            height={40}
                            className="dark:invert h-full w-full"
                        />
                    </Link>
                    <p>We are a made in Kenya Christian clothing wear fashion brand.</p>
                    {/* Social Icons */}
                    <div className="flex gap-4 text-primary">
                        <Link className="hover:text-secondary" href="#">
                            <Image className="w-6 h-6" src="/icons/instagram.svg" alt="Instagram Logo" width={100} height={38} />
                        </Link>
                        <Link className="hover:text-secondary" href="#">
                            <Image className="w-6 h-6" src="/icons/instagram.svg" alt="Facebook Logo" width={100} height={38} />
                        </Link>
                        <Link className="hover:text-secondary" href="#">
                            <Image className="w-6 h-6" src="/icons/tiktok.svg" alt="Tiktok Logo" width={100} height={38} />
                        </Link>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-start gap-2'>
                    <h3 className="font-semibold mb-2 uppercase">Company</h3>
                    <Link className="hover:text-secondary" href={'our-story'}> Our Story</Link>
                    <Link className="hover:text-secondary" href={'size-guide'}> Size Guide</Link>
                    <Link className="hover:text-secondary" href={'contact-us'}> Contact Us</Link>
                </div>
                <div className='flex flex-col items-start justify-start gap-2'>
                    <h3 className="font-semibold mb-2 uppercase">Support</h3>
                    <Link className="hover:text-secondary" href={'warranty'}>Warranty</Link>
                    <Link className="hover:text-secondary" href={'shipping'}>Shipping & Delivery</Link>
                    <Link className="hover:text-secondary" href={'return-policy'}>Return & Refund Policy</Link>
                    <Link className="hover:text-secondary" href={'terms-and-conditions'}>Terms & Conditions</Link>
                    <Link className="hover:text-secondary" href={'privacy policy'}>Privacy Policy</Link>
                </div>
                <div className='flex flex-col items-start justify-start gap-2'>
                    <h3 className="font-semibold mb-2 uppercase">GET IN TOUCH</h3>
                    <p className='flex items-center gap-2'> <PhoneIcon className='w-4 h-4' /> Call us on: 0797616248</p>
                    <p className='flex items-center gap-2'><MailIcon className='w-4 h-4' /> Email: lapislazuli@gmail.com</p>
                </div>
            </div>
        </section>
    )
}
