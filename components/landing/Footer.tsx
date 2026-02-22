import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-20 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                                P
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Geddit
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                            The hyperlocal anonymous network designed for meaningful campus intelligence and honest peer-to-peer communication.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="/feed" className="hover:text-primary transition-colors">Campus Feed</Link></li>
                            <li><Link href="/trending" className="hover:text-primary transition-colors">Hot Trending</Link></li>
                            <li><Link href="/poll" className="hover:text-primary transition-colors">Weekly Polls</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Safety Center</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Community Rules</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Data Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-slate-400 font-medium">
                        © {new Date().getFullYear()} Pulse Campus Network. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                        <span>Made with ❤️ for students</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
