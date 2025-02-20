import Image from 'next/image'
import Link from 'next/link'

export default function About() {
    return (

        <section className="py-12 relative xl:mr-0 lg:mr-5 mr-0">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
                    <article className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                        <div className="w-full flex-col justify-center items-start gap-8 flex">
                            <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h6 className="text-brand-600 dark:text-brand-400 text-base font-normal leading-relaxed">About Us</h6>
                                <article className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">

                                    <h2 className="text-inherit text-5xl font-bold leading-[4rem] mb-7 lg:text-start text-center">The Tale of Our Achievement Story</h2>
                                    <p className="text-gray-600 dark:text-slate-400 text-base font-normal leading-relaxed lg:text-start text-center">
                                        I, as a developer and designer, have always been fascinated by the intersection of design and technology. I have been particularly interested in how design can be useful in solving problems and creating new opportunities. With that in mind, I decided to create a platform to help students who struggle with attendance tracking. On this platform, all students need to do is create a table for their academic year, add the subjects they are studying, and easily track their attendance.
                                    </p>
                                    <p className="text-gray-600 dark:text-slate-400 text-base font-normal leading-relaxed lg:text-start text-center">
                                        I have been working on this project for a while now, and I am excited to share it with you. I hope you find it useful, and I look forward to hearing your feedback.
                                    </p>
                                </article>
                            </div>
                            {/* <div className="w-full flex-col justify-center items-start gap-6 flex">
                                    <div className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                        <div className="w-full h-full p-3.5 rounded-xl border dark:border-gray-200 border-slate-700 dark:hover:border-slate-900 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 dark:text-white text-2xl font-bold leading-9">33+ Years</h4>
                                            <p className="text-gray-600 dark:text-slate-300 text-base font-normal leading-relaxed">Influencing Digital Landscapes Together</p>
                                        </div>
                                        <div className="w-full h-full p-3.5 rounded-xl border dark:border-gray-200 border-slate-700 dark:hover:border-slate-900 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 dark:text-white text-2xl font-bold leading-9">125+ Projects</h4>
                                            <p className="text-gray-600 dark:text-slate-300 text-base font-normal leading-relaxed">Excellence Achieved Through Success</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                        <div className="w-full p-3.5 rounded-xl border dark:border-gray-200 border-slate-700 dark:hover:border-slate-900 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 dark:text-white text-2xl font-bold leading-9">26+ Awards</h4>
                                            <p className="text-gray-600 dark:text-slate-300 text-base font-normal leading-relaxed">Our Dedication to Innovation Wins Understanding</p>
                                        </div>
                                        <div className="w-full h-full p-3.5 rounded-xl border dark:border-gray-200 border-slate-700 dark:hover:border-slate-900 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 dark:text-white text-2xl font-bold leading-9">99% Happy Clients</h4>
                                            <p className="text-gray-600 dark:text-slate-300 text-base font-normal leading-relaxed">Mirrors our Focus on Client Satisfaction.</p>
                                        </div>
                                    </div>
                                </div> */}
                        </div>
                        <Link
                            href={`https://takeshy.tech`}
                            target="_blank"
                            className="sm:w-fit w-full group px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
                            <span className="px-1.5 text-indigo-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">Read More</span>
                            <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </article>
                    <div className="w-full lg:justify-start justify-center items-start flex">
                        <div className="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                            <Image width={562} height={644} className="sm:mt-5 sm:ml-5 w-full h-full" src="https://pagedone.io/asset/uploads/1717742431.png" alt="about Us image" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
