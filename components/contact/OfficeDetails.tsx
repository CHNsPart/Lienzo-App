import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OfficeDetails() {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card className="bg-white transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Contact Us</CardTitle>
          <CardDescription className="text-gray-600">{"We're here to assist you"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ContactItem icon={MapPin} label="123 Lienzo Street, Software City, 12345" />
          <ContactItem icon={Phone} label="+1 (123) 456-7890" />
          <ContactItem icon={Mail} label="contact@lienzo.com" />
        </CardContent>
      </Card>

      <Card className="bg-white transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Office Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm">
            <div>
              <h3 className="font-semibold text-gray-700">Weekdays</h3>
              <p className="text-gray-600">Monday - Friday</p>
              <div className="px-2.5 py-2 rounded-full flex items-center justify-center gap-1 bg-[#F26B60]/5 text-gray-600 mt-2">
                <Clock className="size-4 text-[#F26B60]" />
                <p className="font-medium text-xs md:text-sm text-gray-800">9:00 AM - 5:00 PM</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-700">Weekends</h3>
              <p className="text-gray-600">Saturday - Sunday</p>
              <p className="font-medium text-red-500 mt-2">Closed</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Our support team is available during office hours to help with any inquiries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ContactItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center space-x-3 group">
      <div className="p-2 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-gray-700">{label}</span>
    </div>
  )
}