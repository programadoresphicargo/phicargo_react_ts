import type { RecordComment } from '../models';

interface NotesTimelineProps {
  comments: RecordComment[];
}

const NotesTimeline = ({ comments }: NotesTimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 h-full border-l-2 border-gray-300"></div>
      <div className="space-y-8 pl-12">
        {comments.map((comment, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-1 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <div>
              <p className="text-gray-500 text-sm">
                {comment.createdAt.format('DD/MM/YYYY')}
              </p>
              <p className="text-black font-bold text-lg">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesTimeline;
