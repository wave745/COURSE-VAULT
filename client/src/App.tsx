import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Department from "@/pages/Department";
import DepartmentCourses from "@/pages/DepartmentCourses";
import Course from "@/pages/Course";
import Upload from "@/pages/Upload";
import Profile from "@/pages/Profile";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Verify from "@/pages/Verify";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/verify" component={Verify} />
      <Route path="/college/:slug" component={Department} />
      <Route path="/department/:slug" component={DepartmentCourses} />
      <Route path="/course/:id" component={Course} />
      <Route path="/upload" component={Upload} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
