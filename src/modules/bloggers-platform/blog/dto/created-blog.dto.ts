export class CreatedBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogDto extends CreatedBlogDto {}
