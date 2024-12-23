import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Copy, Link2, LinkIcon, Plus, Video } from 'lucide-react';
import { set } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const MeetingAction = () => {

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const router = useRouter();
  const [generatedMeetingUrl, setGeneratedMeetingUrl] = useState('');
  const [meetingLink, setMeetingLink] = useState('');


  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, [])

  //tao cuoc hop cho sau
  const handleCreateMeetingForLater = () => {
    const roomId = uuidv4();
    console.log('Room ID:', roomId);
    const url = `${baseUrl}/video-meeting/${roomId}`;
    setGeneratedMeetingUrl(url);
    setIsDialogOpen(true);
    toast.success('Meeting created successfully');
  }

  //join vao cuoc hop
  const handleJoinMeeting = () => {
    if (meetingLink) {
      setIsLoading(true);
      const formattedLink = meetingLink.includes('http')
        ? meetingLink : `${baseUrl}/video-meeting/${meetingLink}`;
      router.push(formattedLink);
      toast.info('Joining meeting...');
    }
    else {
      toast.error('Please enter a meeting code or link');
    }
  }

  const handleStartMeeting = () => {
    setIsLoading(true);
    const roomId = uuidv4();
    const meetingUrl = `${baseUrl}/video-meeting/${roomId}`;
    router.push(meetingUrl);
    toast.info('Starting meeting...');
  }

  //sao chep link cuoc hop
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMeetingUrl);
    toast.success('Meeting URL copied to clipboard');
  }

  return (
    <>
      <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto" size='lg' >
              <Video className='w-5 h-5 mr-2'></Video>
              New Meeting
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-1">
            <DropdownMenuItem onClick={handleCreateMeetingForLater}>
              <Link2 className='w-4 h-4 mr-2' />
              Create a meeting for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting}>
              <Plus className='w-4 h-4 mr-2' />
              Star an instant meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        <div className="flex w-full sm:w-auto relative">
          <span className='absolute left-2 top-1/2 transform -translate-y-1/2'>
            <LinkIcon className='w-4 h-4' />
          </span>
          <Input placeholder='Enter a code or link' className='pl-8 rounded-r-none' size='lg'
            value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
          <Button onClick={handleJoinMeeting} variant='secondary' className='rounded-l-none'>
            Join
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-md rounded-lg p-6'>
          <DialogHeader>
            <DialogTitle className="text-3xl font-normal">
              Here's your joining information
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col space-y-4'>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Send this meeting code to people you want to join the meeting. Make sure you don't share this code with anyone else.
            </p>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <span className='text-gray-700 dark:text-gray-200 break-all'>
                {generatedMeetingUrl.slice(0, 30)}...
              </span>

              <Button variant="ghost" className="hover:bg-gray-200" onClick={copyToClipboard}>
                <Copy className='w-5 h-5' />
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}

export default MeetingAction