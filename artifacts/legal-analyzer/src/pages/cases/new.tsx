import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateCase, getListCasesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/layout/Disclaimer";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  defendantName: z.string().optional(),
  caseNumber: z.string().optional(),
  jurisdiction: z.string().optional(),
  notes: z.string().optional(),
});

export default function CaseNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createCase = useCreateCase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      defendantName: "",
      caseNumber: "",
      jurisdiction: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCase.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListCasesQueryKey() });
          toast({ title: "Case created", description: "The workspace is ready." });
          setLocation("/cases");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create case", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-medium tracking-tight">Open a New Case</h1>
            <p className="text-muted-foreground mt-2">Every detail matters. We'll organize it from here.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. State v. Smith Appeal" {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defendantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Defendant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} data-testid="input-defendant" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Number</FormLabel>
                      <FormControl>
                        <Input placeholder="2023-CR-001" {...field} data-testid="input-case-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <FormControl>
                      <Input placeholder="Wisconsin Court of Appeals" {...field} data-testid="input-jurisdiction" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What stands out about this case?" 
                        className="min-h-[120px]"
                        {...field} 
                        data-testid="input-notes" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  disabled={createCase.isPending}
                  data-testid="button-submit-case"
                >
                  {createCase.isPending ? "Creating..." : "Create Workspace"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
