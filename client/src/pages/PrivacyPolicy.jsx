import React from 'react'
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div><div class="max-w-4xl mx-auto px-6 py-12 bg-white shadow-sm sm:shadow-md sm:rounded-xl sm:border border-gray-100 my-10 font-sans text-gray-700">

      <header class="mb-10 border-b border-gray-200 pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p class="text-sm text-gray-500 font-medium">Last updated: October 25, 2026</p>
        </div>

        <div>
          <div onClick={() => navigate('/login')} class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Log In
          </div>
        </div>
      </header>

      <div class="space-y-6 leading-relaxed">
        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>

        <p>We use Your Personal Data to provide and improve the Service. We collect, use, and disclose Your information as described in this Privacy Policy and, where required by applicable law, only where We have a valid legal basis to do so, including Your consent (where consent is required). This Privacy Policy has been created with the help of the <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">Privacy Policy Generator</a>.</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Interpretation and Definitions</h2>

        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">Interpretation</h3>
        <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">Definitions</h3>
        <p>For the purposes of this Privacy Policy:</p>

        <ul class="list-disc list-outside ml-6 space-y-3">
          <li><strong class="text-gray-900">Account</strong> means a unique account created for You to access Our Service or parts of Our Service.</li>
          <li><strong class="text-gray-900">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
          <li><strong class="text-gray-900">Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Privacy Policy) refers to Ellitebattery.</li>
          <li><strong class="text-gray-900">Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website, among its many uses.</li>
          <li><strong class="text-gray-900">Country/State</strong> refers to: Bangladesh.</li>
          <li><strong class="text-gray-900">Device</strong> means any device that can access the Service, such as a computer, a cell phone or a digital tablet.</li>
          <li>
            <strong class="text-gray-900">Personal Data</strong> (or &quot;Personal Information&quot;) is any information that relates to an identified or identifiable individual.
            <p class="mt-2 text-gray-600">We use &quot;Personal Data&quot; and &quot;Personal Information&quot; interchangeably unless a law uses a specific term.</p>
          </li>
          <li><strong class="text-gray-900">Service</strong> refers to the Website.</li>
          <li><strong class="text-gray-900">Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</li>
          <li><strong class="text-gray-900">Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</li>
          <li><strong class="text-gray-900">User</strong> means any individual who accesses or uses the Service.</li>
          <li><strong class="text-gray-900">Website</strong> refers to Ellitebattery, accessible from <a href="https://ellitebattery.com" rel="external nofollow noopener" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline">https://ellitebattery.com</a>.</li>
          <li><strong class="text-gray-900">You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        </ul>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Collecting and Using Your Personal Information</h2>

        <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">Types of Data Collected</h3>

        <h4 class="text-lg font-medium text-gray-800 mt-4 mb-2">Personal Data</h4>
        <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
        <ul class="list-disc list-outside ml-6 space-y-1">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
        </ul>

        <h4 class="text-lg font-medium text-gray-800 mt-6 mb-2">Usage Data</h4>
        <p>Usage Data is collected automatically when using the Service.</p>
        <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of Our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
        <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
        <p>We may also collect information that Your browser sends whenever You visit Our Service or when You access the Service by or through a mobile device.</p>

        <h4 class="text-lg font-medium text-gray-800 mt-6 mb-2">Tracking Technologies and Cookies</h4>
        <p>We use tracking technologies (such as cookies) to track the activity and to improve Our Service. The technologies We use may include:</p>
        <ul class="list-disc list-outside ml-6 space-y-3">
          <li><strong class="text-gray-900">Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of Our Service.</li>
          <li><strong class="text-gray-900">Web Beacons.</strong> Certain sections of Our Service may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
        </ul>
        <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p>
        <p>Where required by law, We use non-essential cookies (that is, Cookies other than the Necessary / Essential Cookies described below) only with Your consent. You can withdraw or change Your consent at any time using Our cookie preferences tool (if available) or through Your browser/device settings. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>

        <p class="font-medium mt-4">We use both Session and Persistent Cookies for the purposes set out below:</p>
        <ul class="space-y-4">
          <li class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <strong class="text-gray-900 block mb-1 text-lg">Necessary / Essential Cookies</strong>
            <p class="text-sm mb-1"><span class="font-medium">Type:</span> Session Cookies</p>
            <p class="text-sm mb-2"><span class="font-medium">Administered by:</span> Us</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Purpose:</span> These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
          </li>
          <li class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <strong class="text-gray-900 block mb-1 text-lg">Cookies Policy / Notice Acceptance Cookies</strong>
            <p class="text-sm mb-1"><span class="font-medium">Type:</span> Persistent Cookies</p>
            <p class="text-sm mb-2"><span class="font-medium">Administered by:</span> Us</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Purpose:</span> These Cookies identify whether users have accepted the use of cookies on the Website and record the consent choices You have made, so that We can honor those choices on future visits.</p>
          </li>
          <li class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <strong class="text-gray-900 block mb-1 text-lg">Functionality Cookies</strong>
            <p class="text-sm mb-1"><span class="font-medium">Type:</span> Persistent Cookies</p>
            <p class="text-sm mb-2"><span class="font-medium">Administered by:</span> Us</p>
            <p class="text-sm text-gray-600"><span class="font-medium">Purpose:</span> These Cookies allow Us to remember choices You make when You use the Website, such as remembering Your Account login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter Your preferences every time You use the Website.</p>
          </li>
        </ul>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for the following purposes:</p>
        <ul class="list-disc list-outside ml-6 space-y-3">
          <li><strong class="text-gray-900">To provide and maintain Our Service</strong>, including to monitor the usage of Our Service.</li>
          <li><strong class="text-gray-900">To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
          <li><strong class="text-gray-900">For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
          <li><strong class="text-gray-900">To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
          <li><strong class="text-gray-900">To provide You</strong> with news, special offers, and general information about other goods, services and events which We offer that are similar to those that You have already purchased or inquired about. We send such marketing communications only where permitted by applicable law: where prior consent is required (for example, under the laws applicable in the EEA and the UK), We will send them only with Your consent; otherwise, We may send them until You opt out. You may opt out or withdraw Your consent at any time by using the unsubscribe link in any marketing email We send or by contacting Us.</li>
          <li><strong class="text-gray-900">To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
          <li><strong class="text-gray-900">For business transfers:</strong> We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about Our Service users is among the assets transferred.</li>
          <li><strong class="text-gray-900">For other purposes:</strong> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of Our promotional campaigns, and evaluating and improving Our Service, products, services, marketing and Your experience.</li>
        </ul>

        <p class="font-medium mt-4">We may share Your Personal Data in the following situations:</p>
        <ul class="list-disc list-outside ml-6 space-y-2">
          <li><strong class="text-gray-900">With Service Providers:</strong> We may share Your Personal Data with Service Providers to monitor and analyze the use of Our Service, and to contact You.</li>
          <li><strong class="text-gray-900">For business transfers:</strong> We may share or transfer Your Personal Data in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
          <li><strong class="text-gray-900">With Affiliates:</strong> We may share Your Personal Data with Our affiliates, in which case We will require those affiliates to honor this Privacy Policy.</li>
          <li><strong class="text-gray-900">With other users:</strong> If Our Service offers public areas, when You share Personal Data or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside the Service.</li>
          <li><strong class="text-gray-900">With Your consent:</strong> We may disclose Your Personal Data for any other purpose with Your consent.</li>
        </ul>

        <h4 class="text-lg font-medium text-gray-800 mt-6 mb-2">Text Messages Privacy Notice</h4>
        <p>You have the option to receive text (SMS) messages from Us. If You opt in to text messages, We will send You updates, notifications, and other communications as described below. When You opt in, We will collect and store the information You provide in connection with text messaging, such as Your phone number, the date and method of Your consent, and message delivery and read information.</p>
        <p>No mobile information will be shared with or sold to third parties or affiliates for marketing or promotional purposes. The phone numbers and consent records We collect for texting are never shared with anyone for any purpose, except the Service Providers that technically have to handle them to deliver the texts.</p>
        <p>Consent to receive text messages is not a condition of any purchase or use of Our Service. If You consent to receive SMS from Us, You agree to receive text messages from Us related to:</p>
        <ul class="list-disc list-outside ml-6 space-y-1">
          <li>Customer care and support</li>
          <li>Account notifications, such as activity, status, or renewal reminders</li>
          <li>Delivery notifications and updates on the status of a delivery</li>
          <li>Authentication messages, such as one-time passwords (OTP) and passcodes</li>
          <li>Security alerts, such as suspicious login attempts or unusual account activity</li>
          <li>Marketing and promotional offers, discounts, and other promotional content</li>
        </ul>
        <p class="text-sm bg-gray-50 p-3 rounded text-gray-600 italic border-l-4 border-gray-300">Reply STOP to opt-out. Reply HELP for support. Message &amp; data rates may apply. Messaging frequency may vary. Carriers are not liable for delayed or undelivered messages.</p>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Retention of Your Personal Data</h3>
        <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with Our legal obligations, resolve disputes, and enforce Our legal agreements and policies.</p>
        <p>Where possible, We apply shorter retention periods and/or reduce identifiability by deleting, aggregating, or anonymizing data. Unless otherwise stated, the retention periods below are maximum periods (&quot;up to&quot;) and We may delete or anonymize data sooner when it is no longer needed for the relevant purpose.</p>

        <ul class="list-disc list-outside ml-6 space-y-3">
          <li>
            <strong class="text-gray-900">Account Information</strong>
            <ul class="list-circle list-outside ml-6 mt-1 space-y-1 text-sm">
              <li>User Accounts: retained for the duration of Your Account relationship plus up to 24 months after account closure.</li>
            </ul>
          </li>
          <li>
            <strong class="text-gray-900">Customer Support Data</strong>
            <ul class="list-circle list-outside ml-6 mt-1 space-y-1 text-sm">
              <li>Support tickets and correspondence: up to 24 months from the date of ticket closure.</li>
              <li>Chat transcripts: up to 24 months for quality assurance.</li>
            </ul>
          </li>
          <li>
            <strong class="text-gray-900">Usage Data</strong>
            <ul class="list-circle list-outside ml-6 mt-1 space-y-1 text-sm">
              <li>Website analytics data (cookies, IP addresses, device identifiers): up to 24 months from the date of collection.</li>
              <li>Server logs (IP addresses, access times): up to 24 months for security monitoring.</li>
            </ul>
          </li>
        </ul>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Transfer of Your Personal Data</h3>
        <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. This means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of Your jurisdiction.</p>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Delete Your Personal Data</h3>
        <p>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
        <p>Our Service may give You the ability to delete certain information about You from within the Service.</p>
        <p>You may update, amend, or delete Your information at any time by signing in to Your Account, if You have one, and visiting the account settings section that allows You to manage Your personal information. You may also contact Us to request access to, correct, or delete any Personal Data that You have provided to Us.</p>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Disclosure of Your Personal Data</h3>
        <h4 class="text-lg font-medium text-gray-800 mt-4 mb-2">Business Transactions</h4>
        <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>

        <h4 class="text-lg font-medium text-gray-800 mt-4 mb-2">Law Enforcement</h4>
        <p>Under certain circumstances, the Company may disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>

        <h4 class="text-lg font-medium text-gray-800 mt-4 mb-2">Other Legal Requirements</h4>
        <p>The Company may disclose Your Personal Data in the good-faith belief that such action is necessary to:</p>
        <ul class="list-disc list-outside ml-6 space-y-1">
          <li>Comply with a legal obligation</li>
          <li>Protect and defend the rights or property of the Company</li>
          <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
          <li>Protect the personal safety of Users of the Service or the public</li>
          <li>Protect against legal liability</li>
        </ul>

        <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-3">Security of Your Personal Data</h3>
        <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Children's and Minors' Privacy</h2>
        <p>The Service is not directed to, and We do not knowingly collect Personal Information from, anyone under the age of 16.</p>
        <p>If You are a parent or guardian and You believe Your child has provided Us with Personal Information, please contact Us. If We become aware that We have collected Personal Information from anyone under the age of 16, We will take steps to remove that information from Our servers as soon as reasonably possible.</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Links to Other Websites</h2>
        <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
        <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Changes to this Privacy Policy</h2>
        <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
        <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>

        <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">Contact Us</h2>
        <p>If You have any questions about this Privacy Policy, You can contact Us:</p>
        <ul class="list-disc list-outside ml-6">
          <li><span class="font-medium text-gray-900">By email:</span> <a href="mailto:nexoriginsoftware@gmail.com" class="text-blue-600 hover:text-blue-800 hover:underline">nexoriginsoftware@gmail.com</a></li>
        </ul>
      </div>
    </div></div>
  )
}

export default PrivacyPolicy