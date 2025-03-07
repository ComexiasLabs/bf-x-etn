import React, { useEffect, useState } from 'react';
import styles from './Step1ChooseTemplate.module.scss';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { Template } from '@core/entities/template';
import { fetchGitHubFileContent } from '@services/web/gitHubService';
import { Config } from '@core/config/config';
import ProjectCard from '@components/atoms/ProjectCard/ProjectCard';

interface Step1ChooseTemplateProps {
  onSelect?: (selected: Template) => void;
}

export default function Step1ChooseTemplate({ onSelect }: Step1ChooseTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  const [templates, setTemplates] = useState<Template[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const handleSelect = (selected: Template) => {
    setSelectedTemplate(selected);
    onSelect && onSelect(selected);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const indexData = await fetchGitHubFileContent(Config.templatesGithubRepo, 'contracts/index.json');
      if (indexData.status === 'Found') {
        const parsedTemplates: Template[] = JSON.parse(indexData.content).map((element) => ({
          templateId: element.id,
          folder: element.folder,
          name: element.name,
          description: element.description,
          creator: element.creator,
        }));
        setTemplates(parsedTemplates);
      } else {
        console.error('Templates not found');
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {!isLoading && (
        <Grid container spacing={3}>
          {templates &&
            templates.map((template) => (
              <Grid key={template.templateId} item xs={12} sm={6} md={4}>
                <Box my={1}>
                  <Card
                    style={{
                      borderTop: selectedTemplate?.templateId === template.templateId ? 'solid 3px black' : 'none',
                    }}
                    onClick={() => handleSelect(template)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          SMART CONTRACT
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          {template.name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} variant="subtitle2" color="text.secondary">
                          By {template.creator}
                        </Typography>
                        <Typography variant="body2">{template.description}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid>
            ))}
        </Grid>
      )}
    </div>
  );
}
