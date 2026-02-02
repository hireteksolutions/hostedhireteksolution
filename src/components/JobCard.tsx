import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, IndianRupee, Clock } from "lucide-react";

interface JobCardProps {
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
  logo?: string;
}

const JobCard = ({
  slug,
  title,
  company,
  location,
  type,
  salary,
  description,
  posted,
  logo,
}: JobCardProps) => {
  return (
    <Card className="transition-smooth hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-4">
          {logo ? (
            <img src={logo} alt={company} className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </Badge>
          <Badge variant="outline">{type}</Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
              {/* <IndianRupee className="h-4 w-4" /> */}
            {salary}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {posted}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/jobs/${slug}`} className="w-full">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
